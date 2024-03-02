import { SQSEvent } from "aws-lambda";
import { db } from "@nicepfp/db";
import EthCrypto from "eth-crypto";
import puppeteer from "puppeteer";
import { create } from "ipfs-http-client";
import { config } from "dotenv";

config();

const hexPrivateKey = process.env.PRIVATE_KEY ?? "";

const ipfsClient = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: "Basic " +
      Buffer.from(
        process.env.IPFS_PROJECT_ID + ":" + process.env.IPFS_PROJECT_SECRET
      ).toString("base64"),
  },
});

export const handler = async (event: SQSEvent) => {

  console.log(`Generating image - ${new Date().toISOString()}`);

  const browser = await puppeteer.connect({ browserURL: 'https://browserless.andreiv.com' })

  console.log(`Puppeteer connect - ${new Date().toISOString()}`);

  const page = await browser.newPage();

  await page.goto("https://nicepfp.art/frame/img", { waitUntil: ["networkidle0"] });

  console.log(`Puppeteer go - ${new Date().toISOString()}`);

  await page.waitForSelector("#defaultCanvas0", { timeout: 60000 })

  await sleep(5000);

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


  if (imageIPFS.path == "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH") {
    await browser.close();
    return {
      statusCode: 500,
    };
  }

  console.log(`IPFS image - ${new Date().toISOString()}`);

  const jsonObj = {
    name: `nicepfp`,
    description: `A very nice pfp created using nicepfp.art`,
    image: `https://ipfs.io/ipfs/${imageIPFS.path}`,
  };

  const objIPFS = await ipfsClient.add(JSON.stringify(jsonObj));

  console.log(`IPFS obj - ${new Date().toISOString()}`);

  let signature = "";
  try {
    const message = EthCrypto.hash.keccak256([
      { type: "string", value: objIPFS.path },
    ]);
    signature = EthCrypto.sign(hexPrivateKey, message);
  }
  catch (e) {
    console.log(e)
  }

  await db.insertInto("entries").values(
    {
      ipfsImage: `https://ipfs.io/ipfs/${imageIPFS.path}`,
      ipfsNFT: objIPFS.path,
      s3Image: "",
      signature: signature,
      locked: false
    }
  ).execute()

  console.log(`
    ipfsImage: https://ipfs.io/ipfs/${imageIPFS.path},
    ipfsNFT: ${objIPFS.path},
    s3Image: ${""},
    signature: ${signature},
    locked: ${false}
    `);

  console.log(`Inserted into db ipfsNFT: ${objIPFS.path}(https://ipfs.io/ipfs/${objIPFS.path}) - ${new Date().toISOString()}`);

  return {
    statusCode: 200,
  };
};


const sleep = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));
