"use server"

import { db, sql } from "@nicepfp/db"
import AWS from "aws-sdk";
import { Queue } from "sst/node/queue";

const sqs = new AWS.SQS();


export const mint = async (address: string, id: string) => {
  console.log(`Add ${id} to mint queue for ${address}`);

  await sqs.sendMessage({
    QueueUrl: Queue.Mint.queueUrl,
    MessageBody: JSON.stringify({
      address: address,
      entryId: id
    }),
  }).promise();

  await db.insertInto('minters').values({ address: address }).execute();
}

export const hasMinted = async (address: string) => {

  const minter = await db.selectFrom('minters').selectAll().where("address", "=", address).executeTakeFirst();

  return minter ? true : false
}

export const getImage = async () => {

  const entries = await db.selectFrom("entries").selectAll().where("locked", "=", false).execute();

  console.log(`Got ${entries.length} photos prepared.`)

  if (entries.length < 100) {
    for (let i = 0; i < 10; i++) {
      await sqs.sendMessage({
        QueueUrl: Queue.GenerateImage.queueUrl,
        MessageBody: "make me a photo",
      }).promise();
    }
    console.log(`Requested generation of 10 photos.`);
  }

  const randomEntry = await db.selectFrom("entries").selectAll().where("locked", "=", false).orderBy(sql`random()`).executeTakeFirst();

  if (!randomEntry)
    return { id: "none", imgSrc: "https://nicepfp.art/assets/welcome.png" }

  return { id: randomEntry.id!, imgSrc: randomEntry.ipfsImage };
}

export const unlock = async (id: string) => {
  await db.updateTable("entries").where("id", "=", id).set({ locked: false }).execute();
  console.log(`Unlocked ${id}`);
}

export const lock = async (id: string) => {
  await db.updateTable("entries").where("id", "=", id).set({ locked: true }).execute();
  console.log(`Locked ${id}`);
}
