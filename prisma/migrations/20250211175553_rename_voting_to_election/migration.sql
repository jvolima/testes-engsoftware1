/*
  Warnings:

  - You are about to drop the `votings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `votingId` on the `votes` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "votings";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "elections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_votes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "voterId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "electionId" TEXT,
    CONSTRAINT "votes_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "voters" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "votes_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "votes_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "elections" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_votes" ("candidateId", "id", "voterId") SELECT "candidateId", "id", "voterId" FROM "votes";
DROP TABLE "votes";
ALTER TABLE "new_votes" RENAME TO "votes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
