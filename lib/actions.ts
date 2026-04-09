"use server";

import { prisma } from "@/lib/db";
import {
  Grant,
  Application,
  Activity,
  User,
  EvaluationQuestion,
  BudgetItem,
  EvaluationResponse,
  ApplicationDocument,
} from "@/types";

// ─── Helpers: DB row → app type ───

function rowToGrant(r: Record<string, unknown>): Grant {
  return {
    ...r,
    focusAreas: JSON.parse(r.focusAreas as string),
    evaluationQuestions: JSON.parse(r.evaluationQuestions as string) as EvaluationQuestion[],
    applications: r.applicationCount as number,
    funderLogo: (r.funderLogo as string) || undefined,
  } as unknown as Grant;
}

function rowToApplication(r: Record<string, unknown>): Application {
  return {
    ...r,
    budgetItems: JSON.parse(r.budgetItems as string) as BudgetItem[],
    evaluationResponses: JSON.parse(r.evaluationResponses as string) as EvaluationResponse[],
    documents: JSON.parse(r.documents as string) as ApplicationDocument[],
    notes: JSON.parse(r.notes as string) as string[],
  } as unknown as Application;
}

// ─── Grants ───

export async function getGrants(): Promise<Grant[]> {
  const rows = await prisma.grant.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((r) => rowToGrant(r as unknown as Record<string, unknown>));
}

export async function getGrant(id: string): Promise<Grant | undefined> {
  const r = await prisma.grant.findUnique({ where: { id } });
  return r ? rowToGrant(r as unknown as Record<string, unknown>) : undefined;
}

export async function saveGrant(grant: Grant): Promise<void> {
  const data = {
    id: grant.id,
    title: grant.title,
    description: grant.description,
    grantType: grant.grantType,
    fundName: grant.fundName,
    fundType: grant.fundType,
    totalAmount: grant.totalAmount,
    minAmount: grant.minAmount,
    maxAmount: grant.maxAmount,
    startDate: grant.startDate,
    endDate: grant.endDate,
    contactPerson: grant.contactPerson,
    contactEmail: grant.contactEmail,
    phone: grant.phone,
    geography: grant.geography,
    country: grant.country,
    state: grant.state || "",
    city: grant.city || "",
    focusAreas: JSON.stringify(grant.focusAreas),
    eligibilityCriteria: grant.eligibilityCriteria,
    expectedOutcomes: grant.expectedOutcomes,
    identifierType: grant.identifierType,
    evaluationQuestions: JSON.stringify(grant.evaluationQuestions),
    aiEvaluation: grant.aiEvaluation,
    status: grant.status,
    applicationCount: grant.applications,
    createdAt: grant.createdAt,
    funderName: grant.funderName,
    funderLogo: grant.funderLogo || "",
  };

  await prisma.grant.upsert({
    where: { id: grant.id },
    update: data,
    create: data,
  });
}

export async function deleteGrant(id: string): Promise<void> {
  await prisma.grant.delete({ where: { id } }).catch(() => {});
}

// ─── Applications ───

export async function getApplications(): Promise<Application[]> {
  const rows = await prisma.application.findMany({ orderBy: { submittedAt: "desc" } });
  return rows.map((r) => rowToApplication(r as unknown as Record<string, unknown>));
}

export async function getApplicationsByGrant(grantId: string): Promise<Application[]> {
  const rows = await prisma.application.findMany({
    where: { grantId },
    orderBy: { submittedAt: "desc" },
  });
  return rows.map((r) => rowToApplication(r as unknown as Record<string, unknown>));
}

export interface ApplicationStats {
  total: number;
  submitted: number;
  inReview: number;
  shortlisted: number;
  approved: number;
  rejected: number;
}

export async function getApplicationStatsForGrant(grantId: string): Promise<ApplicationStats> {
  const rows = await prisma.application.findMany({
    where: { grantId },
    select: { status: true },
  });
  const stats: ApplicationStats = { total: 0, submitted: 0, inReview: 0, shortlisted: 0, approved: 0, rejected: 0 };
  for (const r of rows) {
    stats.total++;
    if (r.status === "Submitted") stats.submitted++;
    else if (r.status === "In Review") stats.inReview++;
    else if (r.status === "Shortlisted") stats.shortlisted++;
    else if (r.status === "Approved") stats.approved++;
    else if (r.status === "Rejected") stats.rejected++;
  }
  return stats;
}

export async function getApplicationStatsForGrants(
  grantIds: string[]
): Promise<Record<string, ApplicationStats>> {
  const rows = await prisma.application.findMany({
    where: { grantId: { in: grantIds } },
    select: { grantId: true, status: true },
  });
  const map: Record<string, ApplicationStats> = {};
  for (const id of grantIds) {
    map[id] = { total: 0, submitted: 0, inReview: 0, shortlisted: 0, approved: 0, rejected: 0 };
  }
  for (const r of rows) {
    const s = map[r.grantId];
    if (!s) continue;
    s.total++;
    if (r.status === "Submitted") s.submitted++;
    else if (r.status === "In Review") s.inReview++;
    else if (r.status === "Shortlisted") s.shortlisted++;
    else if (r.status === "Approved") s.approved++;
    else if (r.status === "Rejected") s.rejected++;
  }
  return map;
}

export async function getApplication(id: string): Promise<Application | undefined> {
  const r = await prisma.application.findUnique({ where: { id } });
  return r ? rowToApplication(r as unknown as Record<string, unknown>) : undefined;
}

export async function saveApplication(app: Application): Promise<void> {
  const data = {
    id: app.id,
    grantId: app.grantId,
    grantTitle: app.grantTitle,
    ngoName: app.ngoName,
    ngoRegistration: app.ngoRegistration,
    ngoLocation: app.ngoLocation,
    ngoContact: app.ngoContact,
    ngoEmail: app.ngoEmail,
    projectTitle: app.projectTitle,
    projectDescription: app.projectDescription,
    targetBeneficiaries: app.targetBeneficiaries,
    implementationTimeline: app.implementationTimeline,
    budgetItems: JSON.stringify(app.budgetItems),
    totalBudget: app.totalBudget,
    evaluationResponses: JSON.stringify(app.evaluationResponses),
    documents: JSON.stringify(app.documents),
    status: app.status,
    score: app.score,
    submittedAt: app.submittedAt,
    notes: JSON.stringify(app.notes),
  };

  await prisma.application.upsert({
    where: { id: app.id },
    update: data,
    create: data,
  });
}

export async function updateApplicationStatus(
  id: string,
  status: string
): Promise<void> {
  const app = await prisma.application.findUnique({ where: { id } });
  if (!app) return;
  await prisma.application.update({ where: { id }, data: { status } });
  await addActivity({
    id: `act-${Date.now()}`,
    type: "status_change",
    message: `${app.ngoName} moved to ${status} for ${app.grantTitle}`,
    timestamp: new Date().toISOString(),
  });
}

export async function bulkUpdateApplicationStatus(
  ids: string[],
  status: string
): Promise<void> {
  await prisma.application.updateMany({
    where: { id: { in: ids } },
    data: { status },
  });
}

// ─── Activities ───

export async function getActivities(): Promise<Activity[]> {
  const rows = await prisma.activity.findMany({ orderBy: { timestamp: "desc" } });
  return rows as unknown as Activity[];
}

export async function addActivity(activity: Activity): Promise<void> {
  await prisma.activity.create({
    data: {
      id: activity.id,
      type: activity.type,
      message: activity.message,
      timestamp: activity.timestamp,
    },
  });
}

// ─── Users ───

export async function getUsers(): Promise<User[]> {
  return (await prisma.user.findMany()) as unknown as User[];
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return (await prisma.user.findUnique({ where: { email } })) as unknown as User | null;
}

export async function getUserById(id: string): Promise<User | null> {
  return (await prisma.user.findUnique({ where: { id } })) as unknown as User | null;
}

export async function updateUser(
  id: string,
  fields: Partial<User> & { phone?: string; city?: string; state?: string }
): Promise<User | null> {
  const updated = await prisma.user.update({ where: { id }, data: fields as Record<string, unknown> });
  return updated as unknown as User;
}

// ─── Notifications ───

export interface DbNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  userId: string;
}

export async function getNotifications(userId: string): Promise<DbNotification[]> {
  return (await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })) as unknown as DbNotification[];
}

export async function markNotificationRead(id: string): Promise<void> {
  await prisma.notification.update({ where: { id }, data: { read: true } });
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

// ─── Wizard State ───

export async function getWizardState(): Promise<string | null> {
  const row = await prisma.wizardState.findUnique({ where: { id: "default" } });
  return row?.state ?? null;
}

export async function saveWizardState(state: string): Promise<void> {
  await prisma.wizardState.upsert({
    where: { id: "default" },
    update: { state },
    create: { id: "default", state },
  });
}

export async function clearWizardState(): Promise<void> {
  await prisma.wizardState.delete({ where: { id: "default" } }).catch(() => {});
}

// ─── Knowledge Documents ───

export interface KnowledgeDoc {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  extractedData: Record<string, string>;
  uploadedAt: string;
}

export async function getKnowledgeDocuments(userId: string): Promise<KnowledgeDoc[]> {
  const rows = await prisma.knowledgeDocument.findMany({
    where: { userId },
    orderBy: { uploadedAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    fileName: r.fileName,
    fileType: r.fileType,
    fileUrl: r.fileUrl,
    extractedData: JSON.parse(r.extractedData as string || "{}"),
    uploadedAt: r.uploadedAt.toISOString(),
  }));
}

export async function uploadKnowledgeDocument(
  userId: string,
  fileName: string,
  fileType: string,
  fileUrl: string
): Promise<string> {
  const doc = await prisma.knowledgeDocument.create({
    data: { userId, fileName, fileType, fileUrl, extractedData: "{}" },
  });
  return doc.id;
}

export async function updateKnowledgeDocExtractedData(
  docId: string,
  extractedData: Record<string, string>
): Promise<void> {
  await prisma.knowledgeDocument.update({
    where: { id: docId },
    data: { extractedData: JSON.stringify(extractedData) },
  });
}

export async function deleteKnowledgeDocument(docId: string): Promise<void> {
  await prisma.knowledgeDocument.delete({ where: { id: docId } }).catch(() => {});
}

// ─── Application Memory ───

export async function getApplicationMemory(
  userId: string
): Promise<Record<string, string>> {
  const rows = await prisma.applicationMemory.findMany({ where: { userId } });
  const map: Record<string, string> = {};
  for (const r of rows) {
    map[r.fieldKey] = r.fieldValue;
  }
  return map;
}

export async function saveApplicationMemory(
  userId: string,
  fields: Record<string, string>
): Promise<void> {
  const ops = Object.entries(fields)
    .filter(([, v]) => v !== "" && v !== "0")
    .map(([key, value]) =>
      prisma.applicationMemory.upsert({
        where: { userId_fieldKey: { userId, fieldKey: key } },
        update: { fieldValue: value },
        create: { userId, fieldKey: key, fieldValue: value },
      })
    );
  await Promise.all(ops);
}

// ─── AI Wrappers (server-side only) ───

export async function aiExtractDocumentData(
  fileText: string,
  fileType: string
): Promise<Record<string, string>> {
  const { extractDocumentData } = await import("@/lib/ai");
  return extractDocumentData(fileText, fileType);
}

export async function aiPromptToFormFields(
  userPrompt: string,
  grantFields: string[]
): Promise<Record<string, string>> {
  const { promptToFormFields } = await import("@/lib/ai");
  return promptToFormFields(userPrompt, grantFields);
}

export async function aiSuggestGrantTemplate(
  funderPrompt: string,
  existingGrants: object[]
): Promise<Record<string, unknown>> {
  const { suggestGrantTemplate } = await import("@/lib/ai");
  return suggestGrantTemplate(funderPrompt, existingGrants);
}

export async function aiSuggestEvalQuestions(
  title: string,
  description: string,
  focusAreas: string[]
): Promise<
  { question: string; responseType: string; maxScore: number; weightage: number }[]
> {
  const { suggestEvalQuestions } = await import("@/lib/ai");
  return suggestEvalQuestions(title, description, focusAreas);
}

// ─── Grant Fit Score ───

export interface FitScoreData {
  id: string;
  totalScore: number;
  geoScore: number;
  focusScore: number;
  eligScore: number;
  impactScore: number;
  docScore: number;
  reasoning: string;
  suggestions: string[];
}

export async function getFitScore(
  userId: string,
  grantId: string
): Promise<FitScoreData | null> {
  const row = await prisma.grantFitScore.findFirst({
    where: { ngoId: userId, grantId },
    orderBy: { createdAt: "desc" },
  });
  if (!row) return null;
  return {
    id: row.id,
    totalScore: row.totalScore,
    geoScore: row.geoScore,
    focusScore: row.focusScore,
    eligScore: row.eligScore,
    impactScore: row.impactScore,
    docScore: row.docScore,
    reasoning: row.reasoning,
    suggestions: JSON.parse(row.suggestions as string),
  };
}

export async function getOrCalculateFitScore(
  userId: string,
  grantId: string
): Promise<FitScoreData> {
  // Check cache first
  const cached = await getFitScore(userId, grantId);
  if (cached) return cached;

  // Build NGO profile from knowledge documents + user record
  const [docs, user, grant] = await Promise.all([
    prisma.knowledgeDocument.findMany({ where: { userId } }),
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.grant.findUnique({ where: { id: grantId } }),
  ]);

  if (!grant) {
    return { id: "", totalScore: 0, geoScore: 0, focusScore: 0, eligScore: 0, impactScore: 0, docScore: 0, reasoning: "Grant not found", suggestions: [] };
  }

  // Merge extracted data from all knowledge documents into a profile
  const ngoProfile: Record<string, unknown> = {};
  for (const doc of docs) {
    try {
      const data = JSON.parse(doc.extractedData as string);
      Object.assign(ngoProfile, data);
    } catch { /* skip bad JSON */ }
  }
  ngoProfile.name = user?.name || "";
  ngoProfile.email = user?.email || "";
  ngoProfile.documentsUploaded = docs.length;

  // Call AI
  const { calculateGrantFitScore } = await import("@/lib/ai");
  const result = await calculateGrantFitScore(ngoProfile, {
    title: grant.title,
    description: grant.description,
    focusAreas: JSON.parse(grant.focusAreas as string),
    geography: grant.geography,
    state: grant.state,
    eligibilityCriteria: grant.eligibilityCriteria,
    grantType: grant.grantType,
    identifierType: grant.identifierType,
    totalAmount: grant.totalAmount,
  });

  // Persist
  const record = await prisma.grantFitScore.create({
    data: {
      ngoId: userId,
      grantId,
      totalScore: result.totalScore,
      geoScore: result.breakdown.geoScore,
      focusScore: result.breakdown.focusScore,
      eligScore: result.breakdown.eligScore,
      impactScore: result.breakdown.impactScore,
      docScore: result.breakdown.docScore,
      reasoning: result.reasoning,
      suggestions: JSON.stringify(result.suggestions),
    },
  });

  return {
    id: record.id,
    totalScore: result.totalScore,
    geoScore: result.breakdown.geoScore,
    focusScore: result.breakdown.focusScore,
    eligScore: result.breakdown.eligScore,
    impactScore: result.breakdown.impactScore,
    docScore: result.breakdown.docScore,
    reasoning: result.reasoning,
    suggestions: result.suggestions,
  };
}

export async function recalculateFitScore(
  userId: string,
  grantId: string
): Promise<FitScoreData> {
  // Delete old scores for this combo
  await prisma.grantFitScore.deleteMany({ where: { ngoId: userId, grantId } });
  // Recalculate
  return getOrCalculateFitScore(userId, grantId);
}
