import { create } from "ipfs-http-client";
import EthCrypto from "eth-crypto";
import sharp from 'sharp'
import { NextRequest, NextResponse } from "next/server";

const authkey =
  "Basic " +
  Buffer.from(
    process.env.IPFS_PROJECT_ID + ":" + process.env.IPFS_PROJECT_SECRET
  ).toString("base64");

const hexPrivateKey = process.env.PRIVATE_KEY ?? "";

const ipfsClient = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: authkey,
  },
});

async function handler(
  req: NextRequest,
  _res: NextResponse
) {

  const formData = await req.formData()
  const imageFile = formData.get('file') as unknown as File | null
  if (!imageFile) {
    return NextResponse.json(null, { status: 400 })
  }

  const imageBuffer = Buffer.from(await imageFile.arrayBuffer())

  const imgBuffer = await sharp(imageBuffer)
    .toBuffer()

  const imageIPFS = await ipfsClient.add(imgBuffer);

  const jsonObj = {
    name: `nicepfp`,
    description: `A very nice pfp created using nicepfp.art`,
    image: `https://ipfs.io/ipfs/${imageIPFS.path}`,
  };
  const jsonIPFS = await ipfsClient.add(JSON.stringify(jsonObj));

  let signature = ""
  try {
    const message = EthCrypto.hash.keccak256([
      { type: "string", value: jsonIPFS.path },
    ]);
    signature = EthCrypto.sign(hexPrivateKey, message);
  }
  catch (e) {
    console.log(e)
  }

  const response = {
    path: jsonIPFS.path,
    signature: signature,
  };

  return NextResponse.json(response)
};

export { handler as POST }
