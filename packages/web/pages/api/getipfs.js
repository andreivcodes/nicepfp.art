import { create } from "ipfs-http-client";
import formidable from "formidable";
import fs from "fs";
import { pathToFileURL } from "url";
const EthCrypto = require("eth-crypto");
const Vibrant = require("node-vibrant");

const authkey =
  "Basic " +
  Buffer.from(
    process.env.IPFS_PROJECT_ID + ":" + process.env.IPFS_PROJECT_SECRET
  ).toString("base64");

const hexPrivateKey = process.env.PRIVATE_KEY;

export const config = {
  api: {
    bodyParser: false,
  },
};

const post = async (req, res) => {
  const client = await create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: authkey,
    },
  });

  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    var file = files.file;

    const img = fs.readFileSync(file.filepath);

    Vibrant.from(file.filepath)
      .getPalette()
      .then(async (palette) => {
        if (
          JSON.stringify(palette.Vibrant) ==
          `{"rgb":[127.5,127.5,127.5],"population":0}`
        ) {
          const imageIPFS = await client.add(img);
          let jsonObj = {
            name: `nicepfp`,
            description: `A very nice pfp created using nicepfp.art`,
            image: `https://ipfs.io/ipfs/${imageIPFS.path}`,
          };
          const jsonIPFS = await client.add(JSON.stringify(jsonObj));

          const message = EthCrypto.hash.keccak256([
            { type: "string", value: jsonIPFS.path },
          ]);
          const signature = EthCrypto.sign(hexPrivateKey, message);

          var response = {
            path: jsonIPFS.path,
            signature: signature,
          };
          console.log(response);
          return res.status(200).json(response);
        }
      });
  });
};

export default (req, res) => {
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
