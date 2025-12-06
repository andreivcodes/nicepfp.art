import type { Kysely } from "kysely";
import { sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Create uuid-ossp extension for uuid_generate_v4()
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.execute(db);

  // Create entries table
  await db.schema
    .createTable("entries")
    .addColumn("id", "text", (col) =>
      col.primaryKey().defaultTo(sql`uuid_generate_v4()::text`)
    )
    .addColumn("ipfsImage", "text", (col) => col.notNull())
    .addColumn("ipfsNFT", "text", (col) => col.notNull())
    .addColumn("signature", "text", (col) => col.notNull())
    .addColumn("locked", "boolean", (col) => col.notNull())
    .addColumn("minted", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("minter_address", "text")
    .execute();

  // Create minters table
  await db.schema
    .createTable("minters")
    .addColumn("id", "text", (col) =>
      col.primaryKey().defaultTo(sql`uuid_generate_v4()::text`)
    )
    .addColumn("address", "text", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("minters").execute();
  await db.schema.dropTable("entries").execute();
}
