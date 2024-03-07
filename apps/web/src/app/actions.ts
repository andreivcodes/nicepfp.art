"use server";

import EthCrypto from "eth-crypto";
import { create } from "ipfs-http-client";

const hexPrivateKey = process.env.PRIVATE_KEY ?? "";

const ipfsClient = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization:
      "Basic " + Buffer.from(process.env.IPFS_PROJECT_ID + ":" + process.env.IPFS_PROJECT_SECRET).toString("base64"),
  },
});

export const getIpfs = async (imageBase64: string) => {
  let response = {
    path: "",
    signature: "",
  };

  const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");

  const imageIPFS = await ipfsClient.add(imageBuffer);

  const jsonObj = {
    name: `nicepfp`,
    description: `A very nice pfp created using nicepfp.art`,
    image: `https://ipfs.io/ipfs/${imageIPFS.path}`,
  };

  const ipfsObj = await ipfsClient.add(JSON.stringify(jsonObj));

  response.path = ipfsObj.path;

  try {
    const message = EthCrypto.hash.keccak256([{ type: "string", value: response.path }]);
    response.signature = EthCrypto.sign(hexPrivateKey, message);
  } catch (e) {
    console.log(e);
  }

  return response;
};
