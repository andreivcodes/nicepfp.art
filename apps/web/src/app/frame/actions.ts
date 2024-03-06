"use server"

import { prisma, redis } from "@/lib/db"

export const mint = async (address: string, id: string) => {
  console.log(`Add ${id} to mint queue for ${address}`);

  const message = {
    address: address,
    entryId: id
  };

  await redis.publish('mint', JSON.stringify(message));
}

export const hasMinted = async (address: string) => {
  const minter = await prisma.minters.findFirst({ where: { address } })
  return minter ? true : false
}

export const getImage = async () => {
  const entries = await prisma.entries.findMany({ where: { locked: false } })

  console.log(`Got ${entries.length} photos prepared.`)

  if (entries.length < 100) {
    for (let i = 0; i < 10; i++) {
      await redis.publish('gen-img', "make me a photo");
    }
    console.log(`Requested generation of 10 photos.`);
  }

  const randomIdResult = await prisma.$queryRaw<{ id: string }[]>`SELECT id FROM entries ORDER BY RAND() LIMIT 1`;

  const randomId = randomIdResult.length > 0 ? randomIdResult[0].id : null;

  if (!randomId) {
    return { id: "none", imgSrc: "https://nicepfp.art/assets/welcome.png" };
  }

  const randomEntry = await prisma.entries.findFirst({ where: { id: randomId } });

  if (!randomEntry)
    return { id: "none", imgSrc: "https://nicepfp.art/assets/welcome.png" }

  return { id: randomEntry.id!, imgSrc: randomEntry.ipfsImage };
}

export const unlock = async (id: string) => {
  if (!id.length) return
  await prisma.entries.update({ where: { id }, data: { locked: false } })
  console.log(`Unlocked ${id}`);
}

export const lock = async (id: string) => {
  if (!id.length) return
  await prisma.entries.update({ where: { id }, data: { locked: true } })
  console.log(`Locked ${id}`);
}
