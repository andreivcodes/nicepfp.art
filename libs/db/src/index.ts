import { Kysely, PostgresDialect } from "kysely";
import { Database } from "./schema";
import { Pool } from 'pg'
import { sql } from "kysely"

const dialect = new PostgresDialect({
  pool: new Pool({
    database: 'test',
    host: 'localhost',
    user: 'admin',
    port: 5434,
    max: 10,
  })
})

export const db = new Kysely<Database>({
  dialect,
})
export { sql }
