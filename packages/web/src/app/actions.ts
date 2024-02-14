"use server"

import EthCrypto from "eth-crypto";
import { create } from "ipfs-http-client";
import sharp from "sharp";

const authkey =
  "Basic " +
  Buffer.from(
    process.env.IPFS_PROJECT_ID + ":" + process.env.IPFS_PROJECT_SECRET
  ).toString("base64");

const hexPrivateKey = process.env.PRIVATE_KEY ?? "";

export const getIpfs = async (imageBase64: string) => {
  let response = {
    path: "",
    signature: ""
  }

  const ipfsClient = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: authkey,
    },
  });


  const imageIPFS = await ipfsClient.add(imageBase64);

  const jsonObj = {
    name: `nicepfp`,
    description: `A very nice pfp created using nicepfp.art`,
    image: `https://ipfs.io/ipfs/${imageIPFS.path}`,
  };

  response.path = (await ipfsClient.add(JSON.stringify(jsonObj))).path;

  try {
    const message = EthCrypto.hash.keccak256([
      { type: "string", value: response.path },
    ]);
    response.signature = EthCrypto.sign(hexPrivateKey, message);
  }
  catch (e) {
    console.log(e)
  }

  return response
}
