import { Grant, Application, User, Activity } from "@/types";
import { mockGrants, mockApplications, mockUsers, mockActivities } from "./mockData";

const STORAGE_KEYS = {
  GRANTS: "daanveda_grants",
  APPLICATIONS: "daanveda_applications",
  USERS: "daanveda_users",
  ACTIVITIES: "daanveda_activities",
  CURRENT_USER: "daanveda_current_user",
  WIZARD_STATE: "daanveda_wizard_state",
  INITIALIZED: "daanveda_initialized",
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function initializeStorage(): void {
  if (!isBrowser()) return;
  if (localStorage.getItem(STORAGE_KEYS.INITIALIZED)) return;

  localStorage.setItem(STORAGE_KEYS.GRANTS, JSON.stringify(mockGrants));
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(mockApplications));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(mockActivities));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(mockUsers[0]));
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
}

// ─── Grants ───
export function getGrants(): Grant[] {
  if (!isBrowser()) return mockGrants;
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.GRANTS);
  return data ? JSON.parse(data) : mockGrants;
}

export function getGrant(id: string): Grant | undefined {
  return getGrants().find((g) => g.id === id);
}

export function saveGrant(grant: Grant): void {
  const grants = getGrants();
  const idx = grants.findIndex((g) => g.id === grant.id);
  if (idx >= 0) grants[idx] = grant;
  else grants.push(grant);
  localStorage.setItem(STORAGE_KEYS.GRANTS, JSON.stringify(grants));
}

export function deleteGrant(id: string): void {
  const grants = getGrants().filter((g) => g.id !== id);
  localStorage.setItem(STORAGE_KEYS.GRANTS, JSON.stringify(grants));
}

// ─── Applications ───
export function getApplications(): Application[] {
  if (!isBrowser()) return mockApplications;
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
  return data ? JSON.parse(data) : mockApplications;
}

export function getApplication(id: string): Application | undefined {
  return getApplications().find((a) => a.id === id);
}

export function saveApplication(app: Application): void {
  const apps = getApplications();
  const idx = apps.findIndex((a) => a.id === app.id);
  if (idx >= 0) apps[idx] = app;
  else apps.push(app);
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
}

export function updateApplicationStatus(
  id: string,
  status: Application["status"]
): void {
  const apps = getApplications();
  const app = apps.find((a) => a.id === id);
  if (app) {
    app.status = status;
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    addActivity({
      id: `act-${Date.now()}`,
      type: "status_change",
      message: `${app.ngoName} moved to ${status} for ${app.grantTitle}`,
      timestamp: new Date().toISOString(),
    });
  }
}

export function bulkUpdateApplicationStatus(
  ids: string[],
  status: Application["status"]
): void {
  const apps = getApplications();
  apps.forEach((app) => {
    if (ids.includes(app.id)) app.status = status;
  });
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
}

// ─── Activities ───
export function getActivities(): Activity[] {
  if (!isBrowser()) return mockActivities;
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
  return data ? JSON.parse(data) : mockActivities;
}

export function addActivity(activity: Activity): void {
  const activities = getActivities();
  activities.unshift(activity);
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
}

// ─── User ───
export function getCurrentUser(): User | null {
  if (!isBrowser()) return mockUsers[0];
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

// ─── Wizard State ───
export function getWizardState(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(STORAGE_KEYS.WIZARD_STATE);
}

export function saveWizardState(state: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.WIZARD_STATE, state);
}

export function clearWizardState(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEYS.WIZARD_STATE);
}
