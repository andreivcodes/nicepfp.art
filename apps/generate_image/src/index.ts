import Redis from "ioredis";
import { config as dotenv_config } from "dotenv";
import puppeteer from "puppeteer";
import EthCrypto from "eth-crypto";
import { PrismaClient } from '@prisma/client'
import { create } from "ipfs-http-client";
import express from "express";

dotenv_config();

const prisma = new PrismaClient()
const redis = new Redis(process.env.REDIS_URL!);
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

redis.subscribe("gen-img", (err, count) => {
  if (err) {
    console.error("Failed to subscribe: %s", err.message);
  } else {
    console.log(
      `Subscribed successfully! This client is currently subscribed to ${count} channels.`
    );
  }
});

redis.on("message", (channel, message) => {
  console.log(`Got message ${message} on ${channel}`)
  generate_image();
});

const app = express();

app.get('/', (_req, res) => {
  res.send("ok");
});

app.listen(3000, () => {
  console.log(`Healthcheck is running at http://localhost:3000`);
});

const generate_image = async () => {
  console.log(`Generating image - ${new Date().toISOString()}`);

  const browser = await puppeteer.connect({
    browserWSEndpoint: `${process.env.BROWSERLESS_WSS}?token=${process.env.BROWSERLESS_TOKEN}`
  })

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
    return
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

  await prisma.entries.create({
    data: {
      ipfsImage: `https://ipfs.io/ipfs/${imageIPFS.path}`,
      ipfsNFT: objIPFS.path,
      signature: signature,
      locked: false
    }
  })

  console.log(`
    ipfsImage: https://ipfs.io/ipfs/${imageIPFS.path},
    ipfsNFT: ${objIPFS.path},
    signature: ${signature},
    locked: ${false}
    `);

  console.log(`Inserted into db ipfsNFT: ${objIPFS.path}(https://ipfs.io/ipfs/${objIPFS.path}) - ${new Date().toISOString()}`);
}

const sleep = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));
