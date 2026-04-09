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
