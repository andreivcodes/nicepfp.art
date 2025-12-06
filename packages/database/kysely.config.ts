import { defineConfig } from "kysely-ctl";
import pg from "pg";
import { PostgresDialect } from "kysely";

const { Pool } = pg;

export default defineConfig({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
  migrations: {
    migrationFolder: "src/migrations",
  },
});
