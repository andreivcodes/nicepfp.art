"use server";

import EthCrypto from "eth-crypto";
import { headers } from "next/headers";
import { PinataSDK } from "pinata";
import { isRateLimited } from "@/lib/rate-limit";
import { parsePngDataUrl } from "@/lib/validate-image";

export type GetIpfsResult = { ok: true; path: string; signature: string } | { ok: false; error: string };

const UNAVAILABLE = "Minting is temporarily unavailable. Please try again later.";
const UPLOADS_PER_WINDOW = 10;
const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;

let pinata: PinataSDK | undefined;
let pinataJwt: string | undefined;

const getPinata = (jwt: string) => {
  if (!pinata || pinataJwt !== jwt) {
    pinata = new PinataSDK({ pinataJwt: jwt, pinataGateway: "gateway.pinata.cloud" });
    pinataJwt = jwt;
  }
  return pinata;
};

// eth-crypto wants the key without the 0x prefix.
const getSigningKey = () => {
  const raw = process.env.PRIVATE_KEY?.trim() ?? "";
  return raw.startsWith("0x") ? raw.slice(2) : raw;
};

const getClientIp = async () => {
  const h = await headers();
  // nicepfp.art is behind Cloudflare, which sets cf-connecting-ip to the real
  // client address; fall back to the proxy headers for other setups.
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return h.get("cf-connecting-ip") || forwarded || h.get("x-real-ip") || null;
};

/**
 * Pins the drawing and its NFT metadata to IPFS and signs the metadata CID
 * with the mint key, so the client can call safeMint(address, path, signature).
 */
export const getIpfs = async (imageDataUrl: string): Promise<GetIpfsResult> => {
  const jwt = process.env.PINATA_API_JWT?.trim();
  const signingKey = getSigningKey();
  if (!jwt || !signingKey) {
    const missing = [!jwt && "PINATA_API_JWT", !signingKey && "PRIVATE_KEY"].filter(Boolean);
    console.error(`[getIpfs] Minting is not configured: ${missing.join(" and ")} not set.`);
    return { ok: false, error: UNAVAILABLE };
  }
  if (!/^[0-9a-fA-F]{64}$/.test(signingKey)) {
    console.error("[getIpfs] PRIVATE_KEY is not a 32-byte hex private key.");
    return { ok: false, error: UNAVAILABLE };
  }

  const image = parsePngDataUrl(imageDataUrl);
  if (!image.ok) return image;

  const ip = await getClientIp();
  if (ip && (await isRateLimited(`ratelimit:getIpfs:${ip}`, UPLOADS_PER_WINDOW, RATE_LIMIT_WINDOW_SECONDS))) {
    return { ok: false, error: "Too many uploads. Please wait a few minutes and try again." };
  }

  let path: string;
  try {
    const client = getPinata(jwt);
    const imageBlob = new Blob([image.buffer], { type: "image/png" });
    const imageFile = new File([imageBlob], "image.png", { type: "image/png" });
    const imageUpload = await client.upload.public.file(imageFile);
    if (!imageUpload?.cid) throw new Error("Pinata returned no CID for the image");

    // The contract and the showcase both assume the https://ipfs.io/ipfs/ prefix.
    const metadataUpload = await client.upload.public.json({
      name: `nicepfp`,
      description: `A very nice pfp created using nicepfp.art`,
      image: `https://ipfs.io/ipfs/${imageUpload.cid}`,
    });
    if (!metadataUpload?.cid) throw new Error("Pinata returned no CID for the metadata");
    path = metadataUpload.cid;
  } catch (e) {
    console.error("[getIpfs] Pinata upload failed:", e);
    return { ok: false, error: "Uploading your pfp to IPFS failed. Please try again." };
  }

  try {
    const message = EthCrypto.hash.keccak256([{ type: "string", value: path }]);
    const signature = EthCrypto.sign(signingKey, message);
    if (!/^0x[0-9a-fA-F]{130}$/.test(signature)) throw new Error("Unexpected signature format");
    return { ok: true, path, signature };
  } catch (e) {
    console.error("[getIpfs] Signing the metadata CID failed:", e);
    return { ok: false, error: UNAVAILABLE };
  }
};
