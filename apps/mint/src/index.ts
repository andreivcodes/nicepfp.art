import Redis from "ioredis";
import { config as dotenv_config } from "dotenv";
import { PrismaClient } from '@prisma/client'
import { createWalletClient, http } from 'viem'
import { polygon } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import * as contractAbi from "./nicepfp_abi.json"
import express from "express";

dotenv_config();

const prisma = new PrismaClient()
const redis = new Redis(process.env.REDIS_URL!);

redis.subscribe("mint", (err, count) => {
  if (err) {
    console.error("Failed to subscribe: %s", err.message);
  } else {
    console.log(
      `Subscribed successfully! This client is currently subscribed to ${count} channels.`
    );
  }
});

const app = express();

app.get('/', (_req, res) => {
  res.send("ok");
});

app.listen(3000, () => {
  console.log(`Healthcheck is running at http://localhost:3000`);
});


redis.on("mint", async (_channel, message) => {
  const { address, entryId }: { address: string, entryId: string } = JSON.parse(message);
  await mint({ address, entryId });
});

const mint = async ({ address, entryId }: { address: string, entryId: string }) => {
  const minter = await prisma.minters.findFirst({ where: { address: address } });
  const entry = await prisma.entries.findFirst({ where: { id: entryId } });

  if (minter) {
    console.log(`Double mint for ${address}`)
    return;
  }

  if (!entry) {
    console.log(`Entry ${entry} not found. This should never happen.`)
    return;
  }

  console.log(`Mint: ${entryId} to ${address}`);

  const account = privateKeyToAccount(process.env.PRIVATE_KEY! as `0x${string}`)

  const walletClient = createWalletClient({
    account,
    chain: polygon,
    transport: http(),
  });

  await walletClient.writeContract({
    address: '0xf8C0f5B3e082343520bDe88d17Fa09E0aeAbEc34',
    abi: contractAbi.abi,
    functionName: 'safeMint',
    args: [address, entry.ipfsNFT, entry.signature],
  })

  await prisma.minters.create({ data: { address: address } })
  await prisma.entries.delete({ where: { id: entry.id } })

  console.log(`Minted: ${entryId} to ${address}`);
}
