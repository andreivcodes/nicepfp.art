import puppeteer from "puppeteer";
import { create } from "ipfs-http-client";

const authkey =
  "Basic " +
  Buffer.from(
    process.env.IPFS_PROJECT_ID + ":" + process.env.IPFS_PROJECT_SECRET
  ).toString("base64");

export const generateImageBase64 = async () => {
  const browser = await puppeteer.connect({ browserURL: 'https://browserless.nicepfp.art' })
  const ipfsClient = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: authkey,
    },
  });

  const page = await browser.newPage();
  await page.goto("https://nicepfp.art/frames/img", { waitUntil: ["networkidle0"] });

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

  return imageIPFS.path;
}

const sleep = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));
