import { SQSEvent } from "aws-lambda";
import { db } from "@nicepfp/db";
import { config } from "dotenv";
import contractAbi from "./nicepfp.json"
import { createWalletClient, http } from 'viem'
import { polygon } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

config();

export const handler = async (event: SQSEvent) => {

  for (const record of event.Records) {
    const { address, entryId } = JSON.parse(record.body);

    const account = privateKeyToAccount(process.env.PRIVATE_KEY! as `0x${string}`)

    const walletClient = createWalletClient({
      account,
      chain: polygon,
      transport: http(),
    })

    const entry = await db.selectFrom("entry").selectAll().where("id", "=", entryId).where('locked', "=", true).executeTakeFirstOrThrow();

    await walletClient.writeContract({
      address: '0xf8C0f5B3e082343520bDe88d17Fa09E0aeAbEc34',
      abi: contractAbi.abi,
      functionName: 'safeMint',
      args: [address, entry.ipfsNFT, entry.signature],
    })

    await db.deleteFrom('entry').where("id", "=", entryId).execute();
  }

  return {
    statusCode: 200,
  };
};
