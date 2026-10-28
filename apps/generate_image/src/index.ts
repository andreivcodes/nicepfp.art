import Redis from "ioredis";
import { config as dotenv_config } from "dotenv";
import puppeteer, { Browser, Page } from "puppeteer";
import EthCrypto from "eth-crypto";
import { db } from "@nicepfp/database";
import { PinataSDK } from "pinata";
import express from "express";

dotenv_config();

// Constants
const DEFAULT_IPFS_HASH = "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH";
const BROWSERLESS_RETRIES = 3;
const BROWSERLESS_RETRY_DELAY = 1000;
// browserless kills a session after its TIMEOUT (30s by default). Loading the
// 11 MB SketchRNN model and drawing a face takes longer than that on a busy
// CPU-only host, so every generation was cut off mid-session.
const BROWSERLESS_SESSION_TIMEOUT_MS = 120_000;
const DRAWING_TIMEOUT_MS = 90_000;
// Generations run one at a time; requests beyond this many waiting are dropped
// (the frame asks for more whenever it runs low, so nothing is lost).
const MAX_PENDING_JOBS = 20;
const HEALTHCHECK_PORT = Number(process.env.PORT ?? 3000);
const DEFAULT_WEB_URL = "http://localhost:3000";

// Initialize services
const redis = new Redis(process.env.REDIS_URL!);

const getSigningKey = () => {
  const raw = process.env.PRIVATE_KEY?.trim() ?? "";
  return raw.startsWith("0x") ? raw.slice(2) : raw;
};

// Without these an entry can't be pinned or signed, so starting Chrome for it
// only wastes a browserless session.
const missingConfig = () =>
  [
    !process.env.PINATA_API_JWT?.trim() && "PINATA_API_JWT",
    !/^[0-9a-fA-F]{64}$/.test(getSigningKey()) && "PRIVATE_KEY",
    !process.env.BROWSERLESS_URL && "BROWSERLESS_URL",
    !process.env.BROWSERLESS_TOKEN && "BROWSERLESS_TOKEN",
  ].filter(Boolean);

let pinata: PinataSDK | undefined;
const getPinata = () => {
  pinata ??= new PinataSDK({
    pinataJwt: process.env.PINATA_API_JWT!.trim(),
    pinataGateway: "gateway.pinata.cloud",
  });
  return pinata;
};

// Healthcheck server
const app = express();
app.get("/", (_req, res) => {
  res.send("OK");
});
app.listen(HEALTHCHECK_PORT, () =>
  console.log(`Healthcheck running on port ${HEALTHCHECK_PORT}`),
);

// Redis subscription
redis.subscribe("gen-img", (err, count) => {
  if (err) console.error("Failed to subscribe:", err.message);
  else console.log(`Subscribed to ${count} channels.`);
});

// Each message used to start its own Chrome immediately, so one frame view
// (10 messages) opened 10 concurrent sessions. Run them one after another.
let pendingJobs = 0;
let queue: Promise<void> = Promise.resolve();

redis.on("message", (channel, message) => {
  console.log(`Received message on ${channel}: ${message}`);

  const missing = missingConfig();
  if (missing.length) {
    console.error(`Skipping image generation: ${missing.join(", ")} not set.`);
    return;
  }
  if (pendingJobs >= MAX_PENDING_JOBS) {
    console.log(`Skipping image generation: ${pendingJobs} jobs already queued.`);
    return;
  }

  pendingJobs++;
  queue = queue
    .then(() => generateImage())
    .catch((error) => console.error("Error generating image:", error))
    .finally(() => {
      pendingJobs--;
    });
});

// Browserless connection
async function connectToBrowserless(): Promise<Browser> {
  const browserlessUrl = process.env.BROWSERLESS_URL;
  const browserlessToken = process.env.BROWSERLESS_TOKEN;

  if (!browserlessUrl || !browserlessToken) {
    throw new Error("Browserless URL or token not configured");
  }

  const endpoint = new URL(browserlessUrl);
  if (endpoint.protocol === "http:") endpoint.protocol = "ws:";
  if (endpoint.protocol === "https:") endpoint.protocol = "wss:";
  endpoint.searchParams.set("token", browserlessToken);
  endpoint.searchParams.set("timeout", String(BROWSERLESS_SESSION_TIMEOUT_MS));
  endpoint.searchParams.set(
    "launch",
    JSON.stringify({
      args: ["--no-sandbox"],
      headless: true,
    }),
  );

  console.log(`Connecting to browserless service at ${endpoint.origin}...`);

  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: endpoint.toString(),
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
    // The sketch sizes its canvas from the window: under 1024px wide it uses
    // 90% of the width and the face runs off the top. Use a desktop viewport
    // so the capture is the same 512x512 canvas the site shows.
    await page.setViewport({ width: 1280, height: 1024 });
    const webUrl =
      process.env.WEB_URL ?? process.env.NEXT_PUBLIC_HOST ?? DEFAULT_WEB_URL;
    const frameUrl = new URL("/frame/img", webUrl).toString();

    // networkidle0 never settled while the model was downloading, and a fixed
    // sleep captured half-drawn faces. sketch.ts marks the body once the
    // SketchRNN stroke sequence has ended.
    await page.goto(frameUrl, { waitUntil: "load", timeout: 60000 });
    await page.waitForSelector("#defaultCanvas0", { timeout: 60000 });
    await page.waitForSelector('body[data-sketch="done"]', { timeout: DRAWING_TIMEOUT_MS });

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

    // Upload image to Pinata (public IPFS network)
    const imageBlob = new Blob([imageBuffer], { type: "image/png" });
    const imageFile = new File([imageBlob], "image.png", { type: "image/png" });
    const imageUpload = await getPinata().upload.public.file(imageFile);

    if (imageUpload.cid === DEFAULT_IPFS_HASH) {
      console.log("Skipping default IPFS hash");
      return;
    }

    console.log(`Image uploaded to Pinata: ${imageUpload.cid}`);

    const jsonObj = {
      name: "nicepfp",
      description: "A very nice pfp created using nicepfp.art",
      image: `https://ipfs.io/ipfs/${imageUpload.cid}`,
    };

    // Upload metadata to Pinata (public IPFS network)
    const metadataUpload = await getPinata().upload.public.json(jsonObj);
    console.log(`Metadata uploaded to Pinata: ${metadataUpload.cid}`);

    const message = EthCrypto.hash.keccak256([
      { type: "string", value: metadataUpload.cid },
    ]);
    const signature = EthCrypto.sign(getSigningKey(), message);

    await db
      .insertInto("entries")
      .values({
        ipfsImage: `https://ipfs.io/ipfs/${imageUpload.cid}`,
        ipfsNFT: metadataUpload.cid,
        signature,
        locked: false,
      })
      .execute();

    console.log(`Entry created in database: ${metadataUpload.cid}`);
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
