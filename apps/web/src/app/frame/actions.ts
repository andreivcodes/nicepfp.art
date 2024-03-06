"use server"

import prisma from "@/lib/db"
import Redis from "ioredis"



export const mint = async (address: string, id: string) => {
  const redis = new Redis(process.env.REDIS_URL!)
  console.log(`Add ${id} to mint queue for ${address}`);

  const message = {
    address: address,
    entryId: id
  };

  await redis.connect();
  await redis.publish('mint', JSON.stringify(message));
  await redis.quit()
}

export const hasMinted = async (address: string) => {
  const minter = await prisma.minters.findFirst({ where: { address } })
  return minter ? true : false
}

export const getImage = async () => {
  const redis = new Redis(process.env.REDIS_URL!)
  const entries = await prisma.entries.findMany({ where: { locked: false } })

  console.log(`Got ${entries.length} photos prepared.`)

  if (entries.length < 100) {
    await redis.connect();
    for (let i = 0; i < 10; i++) {
      await redis.publish('generate', "make me a photo");
    }
    await redis.quit()
    console.log(`Requested generation of 10 photos.`);
  }

  const randomId: string = await prisma.$queryRaw`SELECT id FROM entries ORDER BY RAND() LIMIT 1`;

  const randomEntry = await prisma.entries.findFirst({ where: { id: randomId } })

  if (!randomEntry)
    return { id: "none", imgSrc: "https://nicepfp.art/assets/welcome.png" }

  return { id: randomEntry.id!, imgSrc: randomEntry.ipfsImage };
}

export const unlock = async (id: string) => {
  await prisma.entries.update({ where: { id }, data: { locked: false } })
  console.log(`Unlocked ${id}`);
}

export const lock = async (id: string) => {
  await prisma.entries.update({ where: { id }, data: { locked: true } })
  console.log(`Locked ${id}`);
}
