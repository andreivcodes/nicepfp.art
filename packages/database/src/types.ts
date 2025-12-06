import type { Generated, Insertable, Selectable, Updateable } from "kysely";

// Table interfaces matching the existing Prisma schema
export interface EntriesTable {
  id: Generated<string>;
  ipfsImage: string;
  ipfsNFT: string;
  signature: string;
  locked: boolean;
  minted: Generated<boolean>;
  minter_address: string | null;
}

export interface MintersTable {
  id: Generated<string>;
  address: string;
}

// Database interface combining all tables
export interface Database {
  entries: EntriesTable;
  minters: MintersTable;
}

// Convenience types for CRUD operations
export type Entry = Selectable<EntriesTable>;
export type NewEntry = Insertable<EntriesTable>;
export type EntryUpdate = Updateable<EntriesTable>;

export type Minter = Selectable<MintersTable>;
export type NewMinter = Insertable<MintersTable>;
export type MinterUpdate = Updateable<MintersTable>;
