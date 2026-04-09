import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const MODEL = "gemini-1.5-flash";

// ─── Helpers ───

async function askGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: systemPrompt,
  });
  const result = await model.generateContent(userPrompt);
  return result.response.text();
}

function parseJSON<T>(text: string, fallback: T): T {
  try {
    // Extract JSON from markdown code fences if present
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const raw = match ? match[1].trim() : text.trim();
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// ─── 1. Extract Document Data ───

export async function extractDocumentData(
  fileText: string,
  fileType: string
): Promise<Record<string, string>> {
  try {
    const system = `You are an expert document analyst for Indian NGOs and grant management.
Extract structured data from the provided document. Return ONLY a JSON object with these keys (use empty string if not found):
orgName, registrationNo, fcraNo, mission, vision, focusAreas, geography, foundedYear, teamSize, annualBudget, contactPerson, contactEmail.
For focusAreas and geography, return comma-separated values.
Do not include any text outside the JSON object.`;

    const user = `Document type: ${fileType}\n\nDocument content:\n${fileText}`;
    const result = await askGemini(system, user);
    return parseJSON<Record<string, string>>(result, {});
  } catch (error) {
    console.error("[ai] extractDocumentData failed:", error);
    return {};
  }
}

// ─── 2. Prompt to Form Fields ───

export async function promptToFormFields(
  userPrompt: string,
  grantFields: string[]
): Promise<Record<string, string>> {
  try {
    const system = `You are a helpful assistant for Indian grant applications.
The user will describe their project or organization in free text.
Your job is to extract values for specific form fields from their description.
Return ONLY a JSON object mapping each field name to the extracted value.
If a field cannot be determined from the text, use an empty string.
Do not include any text outside the JSON object.`;

    const user = `Form fields needed: ${JSON.stringify(grantFields)}

User's description:
${userPrompt}`;

    const result = await askGemini(system, user);
    return parseJSON<Record<string, string>>(result, {});
  } catch (error) {
    console.error("[ai] promptToFormFields failed:", error);
    return {};
  }
}

// ─── 3. Calculate Grant Fit Score ───

export interface GrantFitResult {
  totalScore: number;
  breakdown: {
    geoScore: number;
    focusScore: number;
    eligScore: number;
    impactScore: number;
    docScore: number;
  };
  reasoning: string;
  suggestions: string[];
}

export async function calculateGrantFitScore(
  ngoProfile: object,
  grant: object
): Promise<GrantFitResult> {
  const empty: GrantFitResult = {
    totalScore: 0,
    breakdown: { geoScore: 0, focusScore: 0, eligScore: 0, impactScore: 0, docScore: 0 },
    reasoning: "",
    suggestions: [],
  };

  try {
    const system = `You are a grant-fit scoring engine for Indian philanthropy.
Score how well an NGO matches a grant opportunity on these dimensions:
- geoScore (0-20): Geographic alignment between NGO operations and grant's target geography.
- focusScore (0-25): Overlap between NGO's focus areas and grant's focus areas.
- eligScore (0-25): How well the NGO meets the grant's eligibility criteria (registration, FCRA, etc.).
- impactScore (0-15): NGO's past impact evidence and track record.
- docScore (0-15): Profile completeness and documentation readiness.

Return ONLY a JSON object with:
{
  "totalScore": <sum of all scores, 0-100>,
  "breakdown": { "geoScore": <number>, "focusScore": <number>, "eligScore": <number>, "impactScore": <number>, "docScore": <number> },
  "reasoning": "<2-3 sentence explanation>",
  "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>", ...]
}
Do not include any text outside the JSON object.`;

    const user = `NGO Profile:\n${JSON.stringify(ngoProfile, null, 2)}\n\nGrant Details:\n${JSON.stringify(grant, null, 2)}`;
    const result = await askGemini(system, user);
    return parseJSON<GrantFitResult>(result, empty);
  } catch (error) {
    console.error("[ai] calculateGrantFitScore failed:", error);
    return empty;
  }
}

// ─── 4. Generate Status Email ───

export interface StatusEmail {
  subject: string;
  body: string;
}

export async function generateStatusEmail(
  type: "approved" | "rejected" | "shortlisted" | "more_info",
  ngoName: string,
  grantName: string,
  reason?: string
): Promise<StatusEmail> {
  try {
    const system = `You are a professional email writer for an Indian grant management platform (DaanVeda).
Generate a warm, professional email appropriate for the Indian CSR and philanthropy context.
The tone should be respectful and encouraging, even for rejections.
Return ONLY a JSON object with "subject" and "body" keys.
Use plain text for the body (no HTML). Include a greeting and sign-off from "DaanVeda Grant Management Team".
Do not include any text outside the JSON object.`;

    const reasonClause = reason ? `\nAdditional context/reason: ${reason}` : "";
    const user = `Email type: ${type}
NGO name: ${ngoName}
Grant name: ${grantName}${reasonClause}`;

    const result = await askGemini(system, user);
    return parseJSON<StatusEmail>(result, { subject: "", body: "" });
  } catch (error) {
    console.error("[ai] generateStatusEmail failed:", error);
    return { subject: "", body: "" };
  }
}

// ─── 5. Suggest Grant Template ───

export async function suggestGrantTemplate(
  funderPrompt: string,
  existingGrants: object[]
): Promise<Record<string, unknown>> {
  try {
    const system = `You are a grant design assistant for Indian funders on DaanVeda.
Based on the funder's description and their past grants, suggest a complete grant template.
Return ONLY a JSON object with these fields:
{
  "title": "<grant title>",
  "description": "<detailed description>",
  "grantType": "<CSR | Government | Foreign | Trust>",
  "fundType": "<Project | Core | Capacity Building | Research>",
  "totalAmount": <number in INR>,
  "minAmount": <number>,
  "maxAmount": <number>,
  "geography": "<National | State | District | Urban | Rural>",
  "country": "India",
  "state": "<if applicable>",
  "focusAreas": ["<area1>", "<area2>"],
  "eligibilityCriteria": "<detailed criteria>",
  "expectedOutcomes": "<expected outcomes>",
  "evaluationQuestions": [{"question": "<q>", "weightage": <number>}],
  "aiEvaluation": true
}
Ensure amounts are realistic for Indian CSR grants.
Do not include any text outside the JSON object.`;

    const user = `Funder's description:\n${funderPrompt}\n\nPast grants for reference:\n${JSON.stringify(existingGrants, null, 2)}`;
    const result = await askGemini(system, user);
    return parseJSON<Record<string, unknown>>(result, {});
  } catch (error) {
    console.error("[ai] suggestGrantTemplate failed:", error);
    return {};
  }
}

// ─── 6. Suggest Evaluation Questions ───

export async function suggestEvalQuestions(
  title: string,
  description: string,
  focusAreas: string[]
): Promise<{ question: string; responseType: string; maxScore: number; weightage: number }[]> {
  const empty: { question: string; responseType: string; maxScore: number; weightage: number }[] = [];
  try {
    const system = `You are a grant evaluation design expert for Indian philanthropy on DaanVeda.
Given a grant's title, description, and focus areas, suggest exactly 5 evaluation questions for screening NGO applications.
Each question should test a different aspect: organizational capacity, project design, impact potential, sustainability, and financial planning.
Return ONLY a JSON array with 5 objects:
[
  { "question": "<evaluation question>", "responseType": "Textarea", "maxScore": 10, "weightage": <number> }
]
Weightages across all 5 questions must sum to exactly 100.
responseType should be one of: "Text", "Textarea", "Rating", "MCQ".
Do not include any text outside the JSON array.`;

    const user = `Grant Title: ${title}\nDescription: ${description}\nFocus Areas: ${focusAreas.join(", ")}`;
    const result = await askGemini(system, user);
    return parseJSON(result, empty);
  } catch (error) {
    console.error("[ai] suggestEvalQuestions failed:", error);
    return empty;
  }
}
