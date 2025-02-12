-- CreateTable
CREATE TABLE "political_parties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "candidates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "politicalPartyId" TEXT NOT NULL,
    CONSTRAINT "candidates_politicalPartyId_fkey" FOREIGN KEY ("politicalPartyId") REFERENCES "political_parties" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "voters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "electoralTitle" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "votings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "voterId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "votingId" TEXT,
    CONSTRAINT "votes_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "voters" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "votes_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "votes_votingId_fkey" FOREIGN KEY ("votingId") REFERENCES "votings" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "political_parties_name_key" ON "political_parties"("name");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_number_key" ON "candidates"("number");

-- CreateIndex
CREATE UNIQUE INDEX "voters_electoralTitle_key" ON "voters"("electoralTitle");
