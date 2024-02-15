"use server"

import puppeteer from "puppeteer";
import { create } from "ipfs-http-client";
import EthCrypto from "eth-crypto";

const hexPrivateKey = process.env.PRIVATE_KEY ?? "";
const authkey =
  "Basic " +
  Buffer.from(
    process.env.IPFS_PROJECT_ID + ":" + process.env.IPFS_PROJECT_SECRET
  ).toString("base64");

const ipfsClient = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: authkey,
  },
});

export const generateImageBase64 = async () => {
  console.log(`Generating image - ${new Date().toISOString()}`);


  const browser = await puppeteer.connect({ browserURL: 'https://browserless.nicepfp.art' })

  console.log(`Puppeteer connect - ${new Date().toISOString()}`);
  const page = await browser.newPage();
  await page.goto("https://nicepfp.art/frame/img", { waitUntil: ["networkidle0"] });

  console.log(`Puppeteer go - ${new Date().toISOString()}`);
  await sleep(1000)

  const data = await page.evaluate(() => {
    let data: string | undefined = "";
    const canvas = document.querySelector<HTMLCanvasElement>('#defaultCanvas0');
    if (canvas !== null)
      data = canvas.toDataURL();

    return data;
  });

  const imageBuffer = Buffer.from(data.replace(/^data:image\/\w+;base64,/, ""), "base64");

  await browser.close();

  console.log(`Puppeteer close - ${new Date().toISOString()}`);

  const imageIPFS = await ipfsClient.add(imageBuffer);
  let signature = "";

  console.log(`IPFS uploaded - ${new Date().toISOString()}`);

  console.log("Image generated");
  return { image: imageIPFS.path, signature };
}

const sleep = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));
