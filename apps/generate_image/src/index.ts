import Redis from "ioredis";
import { config as dotenv_config } from "dotenv";
import puppeteer, { Browser, Page } from "puppeteer";
import EthCrypto from "eth-crypto";
import { PrismaClient } from "@prisma/client";
import { create } from "ipfs-http-client";
import express from "express";

dotenv_config();

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL!);
const hexPrivateKey = process.env.PRIVATE_KEY ?? "";
const ipfsClient = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization:
      "Basic " +
      Buffer.from(
        process.env.IPFS_PROJECT_ID + ":" + process.env.IPFS_PROJECT_SECRET,
      ).toString("base64"),
  },
});

redis.subscribe("gen-img", (err, count) => {
  if (err) {
    console.error("Failed to subscribe: %s", err.message);
  } else {
    console.log(
      `Subscribed successfully! This client is currently subscribed to ${count} channels.`,
    );
  }
});

redis.on("message", (channel, message) => {
  console.log(`Got message ${message} on ${channel}`);
  generate_image();
});

const app = express();

app.get("/", (_req, res) => {
  res.send("OK");
});

app.listen(3000, () => {
  console.log(`Healthcheck is running at http://localhost:3000`);
});

async function connectToBrowserless(): Promise<Browser> {
  const launchArgs = JSON.stringify({
    args: ["--no-sandbox"],
    headless: true,
  });

  const browserlessUrl = process.env.BROWSERLESS_URL;
  const browserlessToken = process.env.BROWSERLESS_TOKEN;

  if (!browserlessUrl || !browserlessToken) {
    throw new Error("Browserless URL or token not configured");
  }

  const wsUrl = `${browserlessUrl}/?token=${browserlessToken}&launch=${launchArgs}`;

  console.log("Connecting to browserless service...");

  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsUrl,
    });

    if (!browser) {
      throw new Error("Browser initialization failed");
    }

    console.log("Successfully connected to browserless");
    return browser;
  } catch (error) {
    console.error("Failed to connect to browserless:", error);
    throw new Error(
      `Browserless connection failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function connectWithRetry(
  maxRetries = 3,
  delay = 1000,
): Promise<Browser> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const browser = await connectToBrowserless();
      if (!browser) {
        throw new Error("Failed to initialize browser");
      }
      return browser;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Failed to connect after maximum retries");
}

const generate_image = async () => {
  console.log(`Generating image - ${new Date().toISOString()}`);

  const browserlessUrl = process.env.BROWSERLESS_URL;
  const browserlessToken = process.env.BROWSERLESS_TOKEN;

  if (!browserlessUrl || !browserlessToken) {
    throw new Error("Browserless URL or token not configured");
  }

  let browser: Browser | null = null;
  let page: Page | null = null;
  let imageBuffer: Buffer | null = null;

  try {
    browser = await connectWithRetry();
    if (!browser) {
      throw new Error("Failed to initialize browser");
    }

    page = await browser.newPage();
    if (!page) {
      throw new Error("Failed to create new page");
    }

    await page.goto("https://nicepfp.art/frame/img", {
      waitUntil: ["networkidle0"],
    });

    console.log(`Puppeteer go - ${new Date().toISOString()}`);

    await page.waitForSelector("#defaultCanvas0", { timeout: 60000 });

    await sleep(5000);

    const data = await page.evaluate(() => {
      let data: string | undefined = "";
      const canvas =
        document.querySelector<HTMLCanvasElement>("#defaultCanvas0");
      if (canvas !== null) data = canvas.toDataURL();
      return data;
    });

    imageBuffer = Buffer.from(
      data.replace(/^data:image\/\w+;base64,/, ""),
      "base64",
    );
  } catch (error) {
    console.error("Error fetching contribution data:", error);
    throw error;
  } finally {
    if (page) await page.close().catch(console.error);
    if (browser) await browser.close().catch(console.error);
    console.log(`Puppeteer close - ${new Date().toISOString()}`);
  }

  if (imageBuffer == null) return;

  const imageIPFS = await ipfsClient.add(imageBuffer);

  if (imageIPFS.path == "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH") {
    await browser.close();
    return;
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
  } catch (e) {
    console.log(e);
  }

  await prisma.entries.create({
    data: {
      ipfsImage: `https://ipfs.io/ipfs/${imageIPFS.path}`,
      ipfsNFT: objIPFS.path,
      signature: signature,
      locked: false,
    },
  });

  console.log(`
    ipfsImage: https://ipfs.io/ipfs/${imageIPFS.path},
    ipfsNFT: ${objIPFS.path},
    signature: ${signature},
    locked: ${false}
    `);

  console.log(
    `Inserted into db ipfsNFT: ${objIPFS.path}(https://ipfs.io/ipfs/${objIPFS.path}) - ${new Date().toISOString()}`,
  );
};

const sleep = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));
