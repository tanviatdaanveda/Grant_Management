// ─── Grant Types ───
export type GrantType = "CSR" | "Government" | "Foundation" | "Corporate" | "Bilateral";
export type FundType = "Seed" | "Project" | "Operational" | "Capacity Building";
export type GrantStatus = "Active" | "Draft" | "Closed";
export type FocusArea =
  | "Education"
  | "Health"
  | "Women Empowerment"
  | "Environment"
  | "Livelihood"
  | "Disability"
  | "Child Welfare"
  | "Disaster Relief";
export type Geography = "National" | "State" | "City";

export interface EvaluationQuestion {
  id: string;
  question: string;
  responseType: "Text" | "Textarea" | "Rating" | "MCQ";
  maxScore: number;
  weightage: number;
}

export interface Grant {
  id: string;
  title: string;
  description: string;
  grantType: GrantType;
  fundName: string;
  fundType: FundType;
  totalAmount: number;
  minAmount: number;
  maxAmount: number;
  startDate: string;
  endDate: string;
  contactPerson: string;
  contactEmail: string;
  phone: string;
  geography: Geography;
  country: string;
  state: string;
  city: string;
  focusAreas: FocusArea[];
  eligibilityCriteria: string;
  expectedOutcomes: string;
  identifierType: string;
  evaluationQuestions: EvaluationQuestion[];
  aiEvaluation: boolean;
  status: GrantStatus;
  applications: number;
  createdAt: string;
  funderName: string;
  funderLogo?: string;
}

// ─── Application Types ───
export type ApplicationStatus =
  | "Submitted"
  | "In Review"
  | "Shortlisted"
  | "Approved"
  | "Rejected";

export interface BudgetItem {
  id: string;
  category: string;
  amount: number;
  description: string;
}

export interface ApplicationDocument {
  name: string;
  status: "Uploaded" | "Pending" | "Not Required";
  fileName?: string;
}

export interface EvaluationResponse {
  questionId: string;
  question: string;
  answer: string;
}

export interface Application {
  id: string;
  grantId: string;
  grantTitle: string;
  ngoName: string;
  ngoRegistration: string;
  ngoLocation: string;
  ngoContact: string;
  ngoEmail: string;
  projectTitle: string;
  projectDescription: string;
  targetBeneficiaries: number;
  implementationTimeline: string;
  budgetItems: BudgetItem[];
  totalBudget: number;
  evaluationResponses: EvaluationResponse[];
  documents: ApplicationDocument[];
  status: ApplicationStatus;
  score: number;
  submittedAt: string;
  notes: string[];
}

// ─── User Types ───
export type UserRole = "grant_manager" | "ngo_user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  avatar?: string;
}

// ─── Activity Types ───
export interface Activity {
  id: string;
  type: "application_received" | "status_change" | "grant_published" | "note_added";
  message: string;
  timestamp: string;
  relatedId?: string;
}

// ─── Wizard State ───
export interface CreateGrantWizardState {
  currentStep: number;
  data: Partial<Grant>;
}
