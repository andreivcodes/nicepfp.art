"use server";

import EthCrypto from "eth-crypto";
import { PinataSDK } from "pinata";

const hexPrivateKey = process.env.PRIVATE_KEY ?? "";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_API_JWT!,
  pinataGateway: "gateway.pinata.cloud",
});

export const getIpfs = async (imageBase64: string) => {
  let response = {
    path: "",
    signature: "",
  };

  const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");

  // Upload image to Pinata (public IPFS network)
  const imageBlob = new Blob([imageBuffer], { type: "image/png" });
  const imageFile = new File([imageBlob], "image.png", { type: "image/png" });
  const imageUpload = await pinata.upload.public.file(imageFile);

  const jsonObj = {
    name: `nicepfp`,
    description: `A very nice pfp created using nicepfp.art`,
    image: `https://ipfs.io/ipfs/${imageUpload.cid}`,
  };

  // Upload metadata to Pinata (public IPFS network)
  const metadataUpload = await pinata.upload.public.json(jsonObj);

  response.path = metadataUpload.cid;

  try {
    const message = EthCrypto.hash.keccak256([{ type: "string", value: response.path }]);
    // Remove 0x prefix if present for eth-crypto
    const privateKeyForSigning = hexPrivateKey.startsWith('0x') ? hexPrivateKey.slice(2) : hexPrivateKey;
    response.signature = EthCrypto.sign(privateKeyForSigning, message);
  } catch (e) {
    console.log(e);
  }

  return response;
};
