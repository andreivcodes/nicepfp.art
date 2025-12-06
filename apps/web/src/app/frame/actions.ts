"use server";

import { db, redis } from "@/lib/db";
import { sql } from "@nicepfp/database";

export const mint = async (address: string, id: string) => {
  console.log(`Add ${id} to mint queue for ${address}`);

  const message = {
    address: address,
    entryId: id,
  };

  await redis.publish("mint", JSON.stringify(message));
};

export const hasMinted = async (address: string) => {
  const minter = await db
    .selectFrom("minters")
    .selectAll()
    .where("address", "=", address)
    .executeTakeFirst();
  return minter ? true : false;
};

export const getImage = async () => {
  const entries = await db
    .selectFrom("entries")
    .selectAll()
    .where("locked", "=", false)
    .execute();

  console.log(`Got ${entries.length} photos prepared.`);

  if (entries.length < 100) {
    for (let i = 0; i < 10; i++) {
      await redis.publish("gen-img", "make me a photo");
    }
    console.log(`Requested generation of 10 photos.`);
  }

  const randomIdResult = await sql<{ id: string }>`
    SELECT id FROM entries ORDER BY RANDOM() LIMIT 1
  `.execute(db);

  const randomId =
    randomIdResult.rows.length > 0 ? randomIdResult.rows[0].id : null;

  if (!randomId) {
    return { id: "none", imgSrc: "https://nicepfp.art/assets/welcome.png" };
  }

  const randomEntry = await db
    .selectFrom("entries")
    .selectAll()
    .where("id", "=", randomId)
    .executeTakeFirst();

  if (!randomEntry)
    return { id: "none", imgSrc: "https://nicepfp.art/assets/welcome.png" };

  return { id: randomEntry.id!, imgSrc: randomEntry.ipfsImage };
};

export const unlock = async (id: string) => {
  if (!id.length) return;
  try {
    await db
      .updateTable("entries")
      .set({ locked: false })
      .where("id", "=", id)
      .execute();
    console.log(`Unlocked ${id}`);
  } catch {
    // Silently ignore errors (matching original behavior)
  }
};

export const lock = async (id: string) => {
  if (!id.length) return;
  try {
    await db
      .updateTable("entries")
      .set({ locked: true })
      .where("id", "=", id)
      .execute();
    console.log(`Locked ${id}`);
  } catch {
    // Silently ignore errors (matching original behavior)
  }
};
