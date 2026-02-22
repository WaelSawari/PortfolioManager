-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "website" TEXT,
    "description" TEXT,
    "foundedYear" INTEGER,
    "country" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "initialInvestmentDate" DATETIME,
    "totalInvestedAmount" REAL NOT NULL DEFAULT 0,
    "ownershipPct" REAL NOT NULL DEFAULT 0,
    "currentValuation" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "funding_rounds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "roundName" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "preMoneyVal" REAL NOT NULL,
    "postMoneyVal" REAL NOT NULL,
    "roundSize" REAL NOT NULL,
    "ourInvestment" REAL NOT NULL,
    "leadInvestor" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "funding_rounds_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "kpis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "period" TEXT NOT NULL,
    "arr" REAL,
    "mrr" REAL,
    "revenue" REAL,
    "grossMargin" REAL,
    "burnRate" REAL,
    "cashBalance" REAL,
    "runway" INTEGER,
    "headcount" INTEGER,
    "customers" INTEGER,
    "growthMoM" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "kpis_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scenarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "exitYear" INTEGER NOT NULL,
    "exitMultiple" REAL NOT NULL,
    "exitValuation" REAL NOT NULL,
    "ourOwnershipAtExit" REAL NOT NULL,
    "proceeds" REAL NOT NULL,
    "irr" REAL,
    "moic" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "scenarios_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lp_updates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
