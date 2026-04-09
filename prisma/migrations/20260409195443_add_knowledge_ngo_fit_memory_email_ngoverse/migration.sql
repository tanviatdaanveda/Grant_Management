-- CreateTable
CREATE TABLE "KnowledgeDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "extractedData" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "KnowledgeDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NGOProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "orgName" TEXT NOT NULL,
    "registrationNo" TEXT,
    "fcraNo" TEXT,
    "focusAreas" TEXT NOT NULL DEFAULT '[]',
    "geography" TEXT NOT NULL DEFAULT '[]',
    "mission" TEXT,
    "vision" TEXT,
    "foundedYear" INTEGER,
    "teamSize" INTEGER,
    "annualBudget" REAL,
    "impactScore" REAL,
    "documentScore" REAL,
    "profileComplete" REAL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NGOProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GrantFitScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ngoId" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,
    "totalScore" REAL NOT NULL,
    "geoScore" REAL NOT NULL,
    "focusScore" REAL NOT NULL,
    "eligScore" REAL NOT NULL,
    "impactScore" REAL NOT NULL,
    "docScore" REAL NOT NULL,
    "reasoning" TEXT NOT NULL,
    "suggestions" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ApplicationMemory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fieldKey" TEXT NOT NULL,
    "fieldValue" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ApplicationMemory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "NGOVerseProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ngoId" TEXT NOT NULL,
    "totalApps" INTEGER NOT NULL DEFAULT 0,
    "approvedApps" INTEGER NOT NULL DEFAULT 0,
    "approvalRate" REAL NOT NULL DEFAULT 0,
    "grantsReceived" REAL NOT NULL DEFAULT 0,
    "impactScore" REAL NOT NULL DEFAULT 0,
    "fitScore" REAL NOT NULL DEFAULT 0,
    "isShortlisted" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "NGOProfile_userId_key" ON "NGOProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationMemory_userId_fieldKey_key" ON "ApplicationMemory"("userId", "fieldKey");

-- CreateIndex
CREATE UNIQUE INDEX "NGOVerseProfile_ngoId_key" ON "NGOVerseProfile"("ngoId");
