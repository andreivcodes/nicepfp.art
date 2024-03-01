import { sql } from 'kysely';

export async function up(db) {

  await db.schema
    .createTable("entry")
    .addColumn("id", "text", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("ipfsImage", "text", (col) => col.notNull())
    .addColumn("ipfsNFT", "text", (col) => col.notNull())
    .addColumn("signature", "text", (col) => col.notNull())
    .addColumn("locked", "boolean", (col) => col.defaultTo(false))
    .execute();

  await db.schema
    .createTable("minters")
    .addColumn("id", "text", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("address", "text")
    .execute();
}

export async function down(db) {
  await db.schema.dropTable("entry").execute();
  await db.schema.dropTable("minters").execute();
}
