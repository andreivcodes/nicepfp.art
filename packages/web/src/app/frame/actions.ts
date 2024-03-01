"use server"

import { db, sql } from "@nicepfp/db"
import AWS from "aws-sdk";
import { Queue } from "sst/node/queue";

const sqs = new AWS.SQS();

export const mint = async (address: string, id: string) => {
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
  const minter = await db.selectFrom('minters').where("address", "=", address).executeTakeFirst();

  return minter ? true : false
}

export const getImage = async () => {

  const entries = await db.selectFrom("entry").selectAll().where("locked", "=", false).execute();

  console.log(`Got ${entries.length} photos prepared.`)

  if (entries.length < 10) {
    for (let i = 0; i < 10; i++) {
      await sqs.sendMessage({
        QueueUrl: Queue.GenerateImage.queueUrl,
        MessageBody: "make me a photo",
      }).promise();
    }
    console.log(`Requested generation of 10 photos.`);
  }

  const randomEntry = await db.selectFrom("entry").selectAll().where("locked", "=", false).orderBy(sql`random()`).executeTakeFirst();

  if (!randomEntry)
    return { id: "none", imgSrc: "https://nicepfp.art/assets/welcome.png" }

  console.log(`Locked ${randomEntry.id}`);
  await db.updateTable("entry").where("id", "=", randomEntry.id).set({ locked: true }).execute();

  return { id: randomEntry.id!, imgSrc: randomEntry.ipfsImage };
}

export const unlock = async (id: string) => {
  await db.updateTable("entry").where("id", "=", id).set({ locked: false }).execute();
  console.log(`Unlocked ${id}`);
}
