import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import type { Database } from "./types.js";

const { Pool } = pg;

const createPool = () => {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
  });
};

const createDb = () => {
  const dialect = new PostgresDialect({
    pool: createPool(),
  });
  return new Kysely<Database>({ dialect });
};

// Singleton pattern for dev hot reloading (Next.js)
declare global {
  var kyselyDb: Kysely<Database> | undefined;
}

export const db = globalThis.kyselyDb ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalThis.kyselyDb = db;
}
