export type entry = {
  id?: string,
  ipfsImage: string,
  ipfsNFT: string,
  signature: string,
  locked: boolean
};

export type minters = {
  id?: string,
  address: string,
};

export type DB = {
  entry: entry;
  minters: minters;
};
