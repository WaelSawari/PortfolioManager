-- CreateTable
CREATE TABLE "mandates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "funds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mandateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "vintageYear" INTEGER,
    "committedCapital" REAL NOT NULL DEFAULT 0,
    "managementFeePct" REAL,
    "carryPct" REAL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "funds_mandateId_fkey" FOREIGN KEY ("mandateId") REFERENCES "mandates" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "fund_companies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fundId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "investedAmount" REAL NOT NULL DEFAULT 0,
    "ownershipPct" REAL NOT NULL DEFAULT 0,
    "currentFV" REAL,
    "investmentDate" DATETIME,
    "realizedProceeds" REAL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "fund_companies_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fund_companies_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_lp_updates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "fundId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "lp_updates_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_lp_updates" ("content", "createdAt", "id", "period", "status", "title", "updatedAt") SELECT "content", "createdAt", "id", "period", "status", "title", "updatedAt" FROM "lp_updates";
DROP TABLE "lp_updates";
ALTER TABLE "new_lp_updates" RENAME TO "lp_updates";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "fund_companies_fundId_companyId_key" ON "fund_companies"("fundId", "companyId");
