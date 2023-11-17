import { create } from "ipfs-http-client";
import fs from "fs";
import EthCrypto from "eth-crypto";
import Vibrant from "node-vibrant";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";

const authkey =
  "Basic " +
  Buffer.from(
    process.env.IPFS_PROJECT_ID + ":" + process.env.IPFS_PROJECT_SECRET
  ).toString("base64");

const hexPrivateKey = process.env.PRIVATE_KEY ?? "";

export const config = {
  api: {
    bodyParser: false,
  },
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: authkey,
    },
  });

  const form = formidable({});
  
  form.parse(req, async function (err, fields, files) {
    
    if (!files || !files.file || files.file.length === 0) return;

    const file = files.file[0];
    
    if (!file) return;

    const img = fs.readFileSync(file.filepath);

    Vibrant.from(file.filepath)
      .getPalette()
      .then(async (palette) => {
        if (
          JSON.stringify(palette.Vibrant) ==
          `{"rgb":[127.5,127.5,127.5],"population":0}`
        ) {
          const imageIPFS = await client.add(img);
          const jsonObj = {
            name: `nicepfp`,
            description: `A very nice pfp created using nicepfp.art`,
            image: `https://ipfs.io/ipfs/${imageIPFS.path}`,
          };
          const jsonIPFS = await client.add(JSON.stringify(jsonObj));

          const message = EthCrypto.hash.keccak256([
            { type: "string", value: jsonIPFS.path },
          ]);
          const signature = EthCrypto.sign(hexPrivateKey, message);

          const response = {
            path: jsonIPFS.path,
            signature: signature,
          };
          console.log(response);
          return res.status(200).json(response);
        }
      });
  });
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  req.method === "POST"
    ? post(req, res)
    : req.method === "PUT"
    ? console.log("PUT")
    : req.method === "DELETE"
    ? console.log("DELETE")
    : req.method === "GET"
    ? console.log("GET")
    : res.status(404).send("");
};
