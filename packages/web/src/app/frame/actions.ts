"use server"

import puppeteer from "puppeteer";
import { create } from "ipfs-http-client";

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
  console.log("Generating image");

  const browser = await puppeteer.connect({ browserURL: 'https://browserless.nicepfp.art' })

  const page = await browser.newPage();
  await page.goto("https://nicepfp.art/frame/img", { waitUntil: ["networkidle0"] });

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

  const imageIPFS = await ipfsClient.add(imageBuffer);

  console.log("Image generated");
  return imageIPFS.path;
}

const sleep = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));
