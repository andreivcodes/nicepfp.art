-- CreateTable
CREATE TABLE "entries" (
    "id" TEXT NOT NULL,
    "ipfsImage" TEXT NOT NULL,
    "ipfsNFT" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "locked" BOOLEAN NOT NULL,
    "minted" BOOLEAN NOT NULL DEFAULT false,
    "minter_address" TEXT,

    CONSTRAINT "entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "minters" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "minters_pkey" PRIMARY KEY ("id")
);
