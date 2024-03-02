import { Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface EntryTable {
  id: Generated<string>
  s3Image: string,
  ipfsImage: string,
  ipfsNFT: string,
  signature: string,
  locked: boolean
}

export type EntryRow = Selectable<EntryTable>
export type InsertEntry = Insertable<EntryTable>
export type UpdateEntry = Updateable<EntryTable>

export interface MinterTable {
  id: Generated<string>
  address: string
}

export type EntryMinter = Selectable<MinterTable>
export type InsertMinter = Insertable<MinterTable>
export type UpdateMinter = Updateable<MinterTable>

export interface Database {
  entries: EntryTable
  minters: MinterTable
}
