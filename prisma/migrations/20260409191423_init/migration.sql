-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "Grant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "grantType" TEXT NOT NULL,
    "fundName" TEXT NOT NULL,
    "fundType" TEXT NOT NULL,
    "totalAmount" REAL NOT NULL,
    "minAmount" REAL NOT NULL,
    "maxAmount" REAL NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "geography" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "focusAreas" TEXT NOT NULL,
    "eligibilityCriteria" TEXT NOT NULL,
    "expectedOutcomes" TEXT NOT NULL,
    "identifierType" TEXT NOT NULL,
    "evaluationQuestions" TEXT NOT NULL,
    "aiEvaluation" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL,
    "applicationCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TEXT NOT NULL,
    "funderName" TEXT NOT NULL,
    "funderLogo" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "grantId" TEXT NOT NULL,
    "grantTitle" TEXT NOT NULL,
    "ngoName" TEXT NOT NULL,
    "ngoRegistration" TEXT NOT NULL,
    "ngoLocation" TEXT NOT NULL,
    "ngoContact" TEXT NOT NULL,
    "ngoEmail" TEXT NOT NULL,
    "projectTitle" TEXT NOT NULL,
    "projectDescription" TEXT NOT NULL,
    "targetBeneficiaries" INTEGER NOT NULL,
    "implementationTimeline" TEXT NOT NULL,
    "budgetItems" TEXT NOT NULL,
    "totalBudget" REAL NOT NULL,
    "evaluationResponses" TEXT NOT NULL,
    "documents" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "submittedAt" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    CONSTRAINT "Application_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "Grant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WizardState" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "state" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
