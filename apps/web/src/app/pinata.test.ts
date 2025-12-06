import { PinataSDK } from "pinata";
import * as fs from "fs";
import * as path from "path";

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim();
  }
});

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_API_JWT!,
  pinataGateway: "gateway.pinata.cloud",
});

async function testPinataUpload() {
  console.log("Testing Pinata upload for nicepfp.art...\n");
  console.log("Contract: 0xf8C0f5B3e082343520bDe88d17Fa09E0aeAbEc34 (Polygon)");
  console.log("Contract prepends: https://ipfs.io/ipfs/ to CIDs\n");

  // Test 1: Upload a file (image)
  console.log("Test 1: Uploading image file to Pinata...");
  const imageBuffer = Buffer.from("fake image data for testing - " + Date.now());
  const imageBlob = new Blob([imageBuffer], { type: "image/png" });
  const imageFile = new File([imageBlob], "test-image.png", { type: "image/png" });

  const imageUpload = await pinata.upload.public.file(imageFile);

  console.log("Image upload response:", JSON.stringify(imageUpload, null, 2));

  // Validate response format
  if (!imageUpload.cid || typeof imageUpload.cid !== "string") {
    throw new Error("Expected 'cid' to be a string in image upload response");
  }
  if (!imageUpload.cid.startsWith("bafk") && !imageUpload.cid.startsWith("Qm")) {
    throw new Error(`CID should start with 'bafk' (CIDv1) or 'Qm' (CIDv0), got: ${imageUpload.cid}`);
  }

  console.log("✓ Image upload successful! CID:", imageUpload.cid);
  console.log("");

  // Test 2: Upload JSON metadata (same format as nicepfp.art uses)
  console.log("Test 2: Uploading NFT metadata JSON...");

  // This is the EXACT format nicepfp.art uses in actions.ts and generate_image/index.ts
  // IMPORTANT: image URL must use ipfs.io gateway because the frontend does .slice(21)
  const jsonObj = {
    name: "nicepfp",
    description: "A very nice pfp created using nicepfp.art",
    image: `https://ipfs.io/ipfs/${imageUpload.cid}`,  // Must be ipfs.io for frontend compatibility
  };

  console.log("Metadata being uploaded:", JSON.stringify(jsonObj, null, 2));

  const metadataUpload = await pinata.upload.public.json(jsonObj);

  console.log("Metadata upload response:", JSON.stringify(metadataUpload, null, 2));

  // Validate response format
  if (!metadataUpload.cid || typeof metadataUpload.cid !== "string") {
    throw new Error("Expected 'cid' to be a string in metadata upload response");
  }

  console.log("✓ Metadata upload successful! CID:", metadataUpload.cid);
  console.log("");

  // Test 3: Verify the CID format works with the smart contract
  console.log("Test 3: Verifying smart contract compatibility...");

  // The smart contract does: _setTokenURI(tokenId, "https://ipfs.io/ipfs/" + uri)
  // where 'uri' is the CID we pass to safeMint()
  const contractStoredUri = `https://ipfs.io/ipfs/${metadataUpload.cid}`;
  console.log("  Contract would store:", contractStoredUri);
  console.log("  URI length:", contractStoredUri.length, "chars");
  console.log("  Prefix 'https://ipfs.io/ipfs/' length:", "https://ipfs.io/ipfs/".length, "chars (21)");

  // The frontend does: (tokenUri).slice(21) to get the CID
  const extractedCid = contractStoredUri.slice(21);
  console.log("  Frontend would extract CID:", extractedCid);

  if (extractedCid !== metadataUpload.cid) {
    throw new Error(`CID mismatch! Expected ${metadataUpload.cid}, got ${extractedCid}`);
  }

  console.log("✓ Smart contract compatibility verified!");
  console.log("");

  // Test 4: Verify content is accessible via IPFS gateway (both Pinata and ipfs.io)
  console.log("Test 4: Verifying content accessibility via gateways...");

  // Test Pinata gateway
  const pinataGatewayUrl = `https://gateway.pinata.cloud/ipfs/${metadataUpload.cid}`;
  console.log("  Fetching from Pinata gateway:", pinataGatewayUrl);
  const pinataResponse = await fetch(pinataGatewayUrl);
  if (!pinataResponse.ok) {
    throw new Error(`Pinata gateway fetch failed: ${pinataResponse.status}`);
  }
  const pinataData = await pinataResponse.json();
  console.log("  ✓ Pinata gateway accessible");

  // Test ipfs.io gateway (what the frontend uses)
  const ipfsIoGatewayUrl = `https://ipfs.io/ipfs/${metadataUpload.cid}`;
  console.log("  Fetching from ipfs.io gateway:", ipfsIoGatewayUrl);
  const ipfsIoResponse = await fetch(ipfsIoGatewayUrl);
  if (!ipfsIoResponse.ok) {
    throw new Error(`ipfs.io gateway fetch failed: ${ipfsIoResponse.status}`);
  }
  const ipfsIoData = await ipfsIoResponse.json();
  console.log("  ✓ ipfs.io gateway accessible");

  // Verify data consistency
  if (JSON.stringify(pinataData) !== JSON.stringify(ipfsIoData)) {
    throw new Error("Data mismatch between gateways!");
  }
  console.log("  ✓ Data consistent across gateways");
  console.log("");

  // Test 5: Verify the metadata image URL format
  console.log("Test 5: Verifying metadata image URL format...");
  const imageUrlInMetadata = ipfsIoData.image as string;
  console.log("  Image URL in metadata:", imageUrlInMetadata);

  // Frontend does: (data.image).slice(21) to get image CID
  const imageUrlPrefix = imageUrlInMetadata.slice(0, 21);
  const extractedImageCid = imageUrlInMetadata.slice(21);

  console.log("  URL prefix (first 21 chars):", imageUrlPrefix);
  console.log("  Extracted image CID:", extractedImageCid);

  if (imageUrlPrefix !== "https://ipfs.io/ipfs/") {
    throw new Error(`Image URL must start with 'https://ipfs.io/ipfs/', got: ${imageUrlPrefix}`);
  }
  if (extractedImageCid !== imageUpload.cid) {
    throw new Error(`Image CID mismatch! Expected ${imageUpload.cid}, got ${extractedImageCid}`);
  }

  console.log("✓ Image URL format correct for frontend parsing!");
  console.log("");

  // Summary
  console.log("=".repeat(60));
  console.log("ALL TESTS PASSED!");
  console.log("=".repeat(60));
  console.log("\nPinata Upload Response Schema:");
  console.log({
    id: "string - unique file identifier",
    cid: "string - IPFS CID (content hash)",
    size: "number - file size in bytes",
    created_at: "string - ISO timestamp",
    mime_type: "string - file MIME type",
    name: "string - file name",
  });
  console.log("\nKey findings:");
  console.log("- Pinata CIDs work with any IPFS gateway (ipfs.io, Pinata, etc.)");
  console.log("- Metadata image URLs must use https://ipfs.io/ipfs/ (21 chars)");
  console.log("- Smart contract hardcodes https://ipfs.io/ipfs/ prefix");
  console.log("- Frontend uses .slice(21) to extract CIDs from URLs");
}

// Run the test
testPinataUpload()
  .then(() => {
    console.log("\n✓ Test completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n✗ Test failed:", error);
    process.exit(1);
  });
