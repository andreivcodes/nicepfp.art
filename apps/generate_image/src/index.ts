import Redis from "ioredis";
import { config as dotenv_config } from "dotenv";
import puppeteer, { Browser, Page } from "puppeteer";
import EthCrypto from "eth-crypto";
import { PrismaClient } from "@prisma/client";
import { create } from "ipfs-http-client";
import express from "express";

dotenv_config();

// Constants
const DEFAULT_IPFS_HASH = "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH";
const BROWSERLESS_RETRIES = 3;
const BROWSERLESS_RETRY_DELAY = 1000;

// Initialize services
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL!);
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

// Healthcheck server
const app = express();
app.get("/", (_req, res) => {
  res.send("OK");
});
app.listen(3000, () =>
  console.log(`Healthcheck running at http://localhost:3000`),
);

// Redis subscription
redis.subscribe("gen-img", (err, count) => {
  if (err) console.error("Failed to subscribe:", err.message);
  else console.log(`Subscribed to ${count} channels.`);
});

redis.on("message", async (channel, message) => {
  console.log(`Received message on ${channel}: ${message}`);
  try {
    await generateImage();
  } catch (error) {
    console.error("Error generating image:", error);
  }
});

// Browserless connection
async function connectToBrowserless(): Promise<Browser> {
  const browserlessUrl = process.env.BROWSERLESS_URL;
  const browserlessToken = process.env.BROWSERLESS_TOKEN;

  if (!browserlessUrl || !browserlessToken) {
    throw new Error("Browserless URL or token not configured");
  }

  const url = `${browserlessUrl}/?token=${browserlessToken}&launch=${JSON.stringify(
    {
      args: ["--no-sandbox"],
      headless: true,
    },
  )}`;

  console.log("Connecting to browserless service...");
  console.log(`Using URL: ${url}`); // Log the URL being used

  try {
    const browser = await puppeteer.connect({
      browserURL: url,
      defaultViewport: null,
    });

    if (!browser) throw new Error("Browser initialization failed");

    console.log("Successfully connected to browserless");
    return browser;
  } catch (error) {
    console.error("Failed to connect to browserless:", error);
    throw error;
  }
}

async function connectWithRetry(
  maxRetries = BROWSERLESS_RETRIES,
  delay = BROWSERLESS_RETRY_DELAY,
): Promise<Browser> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const browser = await connectToBrowserless();
      return browser;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
      await sleep(delay);
    }
  }
  throw new Error("Failed to connect after maximum retries");
}

// Image generation
async function generateImage(): Promise<void> {
  console.log(`Starting image generation at ${new Date().toISOString()}`);

  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    browser = await connectWithRetry();
    page = await browser.newPage();
    await page.goto("https://nicepfp.art/frame/img", {
      waitUntil: "networkidle0",
    });
    await page.waitForSelector("#defaultCanvas0", { timeout: 60000 });
    await sleep(5000);

    const data = await page.evaluate(() => {
      const canvas =
        document.querySelector<HTMLCanvasElement>("#defaultCanvas0");
      return canvas?.toDataURL();
    });

    if (!data) throw new Error("Failed to capture canvas data");

    const imageBuffer = Buffer.from(
      data.replace(/^data:image\/\w+;base64,/, ""),
      "base64",
    );
    const imageIPFS = await ipfsClient.add(imageBuffer);

    if (imageIPFS.path === DEFAULT_IPFS_HASH) {
      console.log("Skipping default IPFS hash");
      return;
    }

    console.log(`Image uploaded to IPFS: ${imageIPFS.path}`);

    const jsonObj = {
      name: "nicepfp",
      description: "A very nice pfp created using nicepfp.art",
      image: `https://ipfs.io/ipfs/${imageIPFS.path}`,
    };

    const objIPFS = await ipfsClient.add(JSON.stringify(jsonObj));
    console.log(`Metadata uploaded to IPFS: ${objIPFS.path}`);

    const message = EthCrypto.hash.keccak256([
      { type: "string", value: objIPFS.path },
    ]);
    const signature = EthCrypto.sign(process.env.PRIVATE_KEY!, message);

    await prisma.entries.create({
      data: {
        ipfsImage: `https://ipfs.io/ipfs/${imageIPFS.path}`,
        ipfsNFT: objIPFS.path,
        signature,
        locked: false,
      },
    });

    console.log(`Entry created in database: ${objIPFS.path}`);
  } catch (error) {
    console.error("Error during image generation:", error);
    throw error;
  } finally {
    if (page) await page.close().catch(console.error);
    if (browser) await browser.close().catch(console.error);
    console.log(`Browser closed at ${new Date().toISOString()}`);
  }
}

// Utility
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
