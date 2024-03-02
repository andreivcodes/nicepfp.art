import { RDSData } from "@aws-sdk/client-rds-data";
import { Kysely } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { RDS } from "sst/node/rds";
import { Database } from "./schema";
import { sql } from "kysely"

const dataApi = new DataApiDialect({
  mode: "postgres",
  driver: {
    client: new RDSData({}),
    database: "gitshow_db",
    secretArn: RDS.Database.secretArn,
    resourceArn: RDS.Database.clusterArn,
  },
});

export const db = new Kysely<Database>({ dialect: dataApi });
export { sql }
