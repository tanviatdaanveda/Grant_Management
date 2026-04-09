"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Grant, EvaluationQuestion, FocusArea, GrantType, FundType, Geography } from "@/types";
import { saveGrant, addActivity, getWizardState, saveWizardState, clearWizardState } from "@/lib/actions";
import { generateId, formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus, Trash2, CheckCircle2, Save } from "lucide-react";

const steps = ["Basic Details", "Targeting", "Evaluation Setup", "Review & Publish"];

const focusAreas: FocusArea[] = [
  "Education", "Health", "Women Empowerment", "Environment",
  "Livelihood", "Disability", "Child Welfare", "Disaster Relief",
];

const grantTypes: GrantType[] = ["CSR", "Government", "Foundation", "Corporate", "Bilateral"];
const fundTypes: FundType[] = ["Seed", "Project", "Operational", "Capacity Building"];

const emptyGrant: Partial<Grant> = {
  title: "",
  description: "",
  grantType: "CSR",
  fundName: "",
  fundType: "Project",
  totalAmount: 0,
  minAmount: 0,
  maxAmount: 0,
  startDate: "",
  endDate: "",
  contactPerson: "",
  contactEmail: "",
  phone: "",
  geography: "National",
  country: "India",
  state: "",
  city: "",
  focusAreas: [],
  eligibilityCriteria: "",
  expectedOutcomes: "",
  identifierType: "NGO Reg No.",
  evaluationQuestions: [],
  aiEvaluation: false,
};

export default function CreateGrantPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Partial<Grant>>(emptyGrant);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    getWizardState().then((saved) => {
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setData(parsed.data || emptyGrant);
          setCurrentStep(parsed.currentStep || 0);
        } catch {
          // ignore parse errors
        }
      }
    });
  }, []);

  const persistState = (step: number, newData: Partial<Grant>) => {
    saveWizardState(JSON.stringify({ currentStep: step, data: newData }));
  };

  const updateField = <K extends keyof Grant>(field: K, value: Grant[K]) => {
    const updated = { ...data, [field]: value };
    setData(updated);
    persistState(currentStep, updated);
  };

  const nextStep = () => {
    const next = Math.min(currentStep + 1, steps.length - 1);
    setCurrentStep(next);
    persistState(next, data);
  };

  const prevStep = () => {
    const prev = Math.max(currentStep - 1, 0);
    setCurrentStep(prev);
    persistState(prev, data);
  };

  const addQuestion = () => {
    const questions = [...(data.evaluationQuestions || [])];
    questions.push({
      id: generateId(),
      question: "",
      responseType: "Textarea",
      maxScore: 10,
      weightage: 0,
    });
    updateField("evaluationQuestions", questions);
  };

  const updateQuestion = (index: number, field: keyof EvaluationQuestion, value: string | number) => {
    const questions = [...(data.evaluationQuestions || [])];
    questions[index] = { ...questions[index], [field]: value };
    updateField("evaluationQuestions", questions);
  };

  const removeQuestion = (index: number) => {
    const questions = [...(data.evaluationQuestions || [])];
    questions.splice(index, 1);
    updateField("evaluationQuestions", questions);
  };

  const toggleFocusArea = (area: FocusArea) => {
    const current = data.focusAreas || [];
    const updated = current.includes(area)
      ? current.filter((a) => a !== area)
      : [...current, area];
    updateField("focusAreas", updated);
  };

  const publishGrant = async () => {
    const grant: Grant = {
      id: generateId(),
      title: data.title || "Untitled Grant",
      description: data.description || "",
      grantType: data.grantType || "CSR",
      fundName: data.fundName || "",
      fundType: data.fundType || "Project",
      totalAmount: data.totalAmount || 0,
      minAmount: data.minAmount || 0,
      maxAmount: data.maxAmount || 0,
      startDate: data.startDate || new Date().toISOString(),
      endDate: data.endDate || new Date().toISOString(),
      contactPerson: data.contactPerson || "",
      contactEmail: data.contactEmail || "",
      phone: data.phone || "",
      geography: data.geography || "National",
      country: data.country || "India",
      state: data.state || "",
      city: data.city || "",
      focusAreas: data.focusAreas || [],
      eligibilityCriteria: data.eligibilityCriteria || "",
      expectedOutcomes: data.expectedOutcomes || "",
      identifierType: data.identifierType || "NGO Reg No.",
      evaluationQuestions: data.evaluationQuestions || [],
      aiEvaluation: data.aiEvaluation || false,
      status: "Active",
      applications: 0,
      createdAt: new Date().toISOString(),
      funderName: data.fundName || "DaanVeda Foundation",
    };

    await saveGrant(grant);
    await addActivity({
      id: `act-${Date.now()}`,
      type: "grant_published",
      message: `${grant.title} published and accepting applications`,
      timestamp: new Date().toISOString(),
    });
    await clearWizardState();
    setShowSuccess(true);
    setTimeout(() => router.push("/dashboard/grants"), 2000);
  };

  const saveDraft = async () => {
    const grant: Grant = {
      id: generateId(),
      title: data.title || "Untitled Grant",
      description: data.description || "",
      grantType: data.grantType || "CSR",
      fundName: data.fundName || "",
      fundType: data.fundType || "Project",
      totalAmount: data.totalAmount || 0,
      minAmount: data.minAmount || 0,
      maxAmount: data.maxAmount || 0,
      startDate: data.startDate || new Date().toISOString(),
      endDate: data.endDate || new Date().toISOString(),
      contactPerson: data.contactPerson || "",
      contactEmail: data.contactEmail || "",
      phone: data.phone || "",
      geography: data.geography || "National",
      country: data.country || "India",
      state: data.state || "",
      city: data.city || "",
      focusAreas: data.focusAreas || [],
      eligibilityCriteria: data.eligibilityCriteria || "",
      expectedOutcomes: data.expectedOutcomes || "",
      identifierType: data.identifierType || "NGO Reg No.",
      evaluationQuestions: data.evaluationQuestions || [],
      aiEvaluation: data.aiEvaluation || false,
      status: "Draft",
      applications: 0,
      createdAt: new Date().toISOString(),
      funderName: data.fundName || "DaanVeda Foundation",
    };

    await saveGrant(grant);
    await clearWizardState();
    router.push("/dashboard/grants");
  };

  const totalWeightage = (data.evaluationQuestions || []).reduce(
    (sum, q) => sum + (q.weightage || 0),
    0
  );

  return (
    <>
      <Header title="Create New Grant" />
      <main className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right">
            <CheckCircle2 className="h-5 w-5" />
            Grant published successfully!
          </div>
        )}

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                      i <= currentStep
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                    )}
                  >
                    {i < currentStep ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  <span
                    className={cn(
                      "mt-1 text-xs font-medium hidden sm:block",
                      i <= currentStep ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"
                    )}
                  >
                    {step}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 w-12 sm:w-20 lg:w-32",
                      i < currentStep ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Step 1: Basic Details */}
            {currentStep === 0 && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Details</h2>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="title">Grant Title *</Label>
                    <Input
                      id="title"
                      value={data.title || ""}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder="e.g., Rural Education Enhancement Program"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={data.description || ""}
                      onChange={(e) => updateField("description", e.target.value)}
                      placeholder="Describe the purpose and scope of this grant..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="grantType">Grant Type</Label>
                      <Select
                        id="grantType"
                        value={data.grantType || "CSR"}
                        onChange={(e) => updateField("grantType", e.target.value as GrantType)}
                        className="mt-1"
                      >
                        {grantTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="fundType">Fund Type</Label>
                      <Select
                        id="fundType"
                        value={data.fundType || "Project"}
                        onChange={(e) => updateField("fundType", e.target.value as FundType)}
                        className="mt-1"
                      >
                        {fundTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="fundName">Fund Name</Label>
                    <Input
                      id="fundName"
                      value={data.fundName || ""}
                      onChange={(e) => updateField("fundName", e.target.value)}
                      placeholder="e.g., Tata Education Trust"
                      className="mt-1"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="totalAmount">Total Amount (₹)</Label>
                      <Input
                        id="totalAmount"
                        type="number"
                        value={data.totalAmount || ""}
                        onChange={(e) => updateField("totalAmount", Number(e.target.value))}
                        placeholder="50,00,000"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="minAmount">Min per NGO (₹)</Label>
                      <Input
                        id="minAmount"
                        type="number"
                        value={data.minAmount || ""}
                        onChange={(e) => updateField("minAmount", Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxAmount">Max per NGO (₹)</Label>
                      <Input
                        id="maxAmount"
                        type="number"
                        value={data.maxAmount || ""}
                        onChange={(e) => updateField("maxAmount", Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={data.startDate || ""}
                        onChange={(e) => updateField("startDate", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={data.endDate || ""}
                        onChange={(e) => updateField("endDate", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="contactPerson">Contact Person</Label>
                      <Input
                        id="contactPerson"
                        value={data.contactPerson || ""}
                        onChange={(e) => updateField("contactPerson", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={data.contactEmail || ""}
                        onChange={(e) => updateField("contactEmail", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={data.phone || ""}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Targeting */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Targeting</h2>
                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="geography">Geography</Label>
                      <Select
                        id="geography"
                        value={data.geography || "National"}
                        onChange={(e) => updateField("geography", e.target.value as Geography)}
                        className="mt-1"
                      >
                        <option value="National">National</option>
                        <option value="State">State</option>
                        <option value="City">City</option>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={data.state || ""}
                        onChange={(e) => updateField("state", e.target.value)}
                        placeholder="e.g., Karnataka"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={data.city || ""}
                        onChange={(e) => updateField("city", e.target.value)}
                        placeholder="e.g., Bengaluru"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Focus Areas</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {focusAreas.map((area) => (
                        <label
                          key={area}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition-colors",
                            (data.focusAreas || []).includes(area)
                              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-600"
                              : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                          )}
                        >
                          <Checkbox
                            checked={(data.focusAreas || []).includes(area)}
                            onCheckedChange={() => toggleFocusArea(area)}
                          />
                          <span className="text-sm font-medium">{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label htmlFor="eligibility">Eligibility Criteria</Label>
                      <span className="text-xs text-gray-400">
                        {(data.eligibilityCriteria || "").length}/500
                      </span>
                    </div>
                    <Textarea
                      id="eligibility"
                      value={data.eligibilityCriteria || ""}
                      onChange={(e) => updateField("eligibilityCriteria", e.target.value)}
                      placeholder="Describe who is eligible to apply..."
                      rows={4}
                      maxLength={500}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label htmlFor="outcomes">Expected Outcomes</Label>
                      <span className="text-xs text-gray-400">
                        {(data.expectedOutcomes || "").length}/500
                      </span>
                    </div>
                    <Textarea
                      id="outcomes"
                      value={data.expectedOutcomes || ""}
                      onChange={(e) => updateField("expectedOutcomes", e.target.value)}
                      placeholder="What outcomes do you expect from funded projects?"
                      rows={4}
                      maxLength={500}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Evaluation Setup */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Evaluation Setup</h2>

                <div>
                  <Label htmlFor="identifierType">Identifier Type</Label>
                  <Select
                    id="identifierType"
                    value={data.identifierType || "NGO Reg No."}
                    onChange={(e) => updateField("identifierType", e.target.value)}
                    className="mt-1 max-w-xs"
                  >
                    {["NGO Reg No.", "FCRA", "CSR-1", "PAN", "80G"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </Select>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Evaluation Questions</Label>
                    <Button variant="outline" size="sm" onClick={addQuestion}>
                      <Plus className="mr-1 h-3 w-3" /> Add Question
                    </Button>
                  </div>

                  {(data.evaluationQuestions || []).length === 0 ? (
                    <div className="text-center py-8 text-gray-400 border border-dashed border-gray-300 rounded-lg dark:border-gray-600">
                      No questions added yet. Click &quot;Add Question&quot; to create evaluation criteria.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(data.evaluationQuestions || []).map((q, i) => (
                        <div
                          key={q.id}
                          className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-xs font-medium text-gray-400">Question {i + 1}</span>
                            <button
                              onClick={() => removeQuestion(i)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="grid gap-3">
                            <Input
                              value={q.question}
                              onChange={(e) => updateQuestion(i, "question", e.target.value)}
                              placeholder="Enter evaluation question..."
                            />
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <Label className="text-xs">Response Type</Label>
                                <Select
                                  value={q.responseType}
                                  onChange={(e) => updateQuestion(i, "responseType", e.target.value)}
                                  className="mt-1"
                                >
                                  {["Text", "Textarea", "Rating", "MCQ"].map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                  ))}
                                </Select>
                              </div>
                              <div>
                                <Label className="text-xs">Max Score</Label>
                                <Input
                                  type="number"
                                  value={q.maxScore}
                                  onChange={(e) => updateQuestion(i, "maxScore", Number(e.target.value))}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Weightage %</Label>
                                <Input
                                  type="number"
                                  value={q.weightage}
                                  onChange={(e) => updateQuestion(i, "weightage", Number(e.target.value))}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Scoring Summary */}
                      <div className={cn(
                        "rounded-lg p-3 text-sm font-medium flex items-center justify-between",
                        totalWeightage === 100
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                      )}>
                        <span>Total Weightage</span>
                        <span>{totalWeightage}% / 100%</span>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Enable AI-powered screening</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Automatically score and rank applications using AI evaluation
                    </p>
                  </div>
                  <Switch
                    checked={data.aiEvaluation || false}
                    onCheckedChange={(checked) => updateField("aiEvaluation", checked)}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review & Publish */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Review & Publish</h2>

                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/30">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">Grant Details</h3>
                    <dl className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-500 dark:text-gray-400">Title</dt>
                        <dd className="font-medium text-gray-900 dark:text-white">{data.title || "—"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500 dark:text-gray-400">Type</dt>
                        <dd>{data.grantType} / {data.fundType}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500 dark:text-gray-400">Fund Name</dt>
                        <dd>{data.fundName || "—"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500 dark:text-gray-400">Total Amount</dt>
                        <dd className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {data.totalAmount ? formatCurrency(data.totalAmount) : "—"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500 dark:text-gray-400">Per NGO Range</dt>
                        <dd>
                          {data.minAmount ? formatCurrency(data.minAmount) : "—"} —{" "}
                          {data.maxAmount ? formatCurrency(data.maxAmount) : "—"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500 dark:text-gray-400">Duration</dt>
                        <dd>
                          {data.startDate ? formatDate(data.startDate) : "—"} to{" "}
                          {data.endDate ? formatDate(data.endDate) : "—"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/30">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">Targeting</h3>
                    <dl className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-500 dark:text-gray-400">Geography</dt>
                        <dd>
                          {data.geography}
                          {data.state ? ` — ${data.state}` : ""}
                          {data.city ? `, ${data.city}` : ""}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-500 dark:text-gray-400 mb-1">Focus Areas</dt>
                        <dd className="flex flex-wrap gap-1">
                          {(data.focusAreas || []).map((area) => (
                            <Badge key={area} variant="default">{area}</Badge>
                          ))}
                          {(data.focusAreas || []).length === 0 && (
                            <span className="text-gray-400">None selected</span>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/30">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">Evaluation</h3>
                    <dl className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-500 dark:text-gray-400">Questions</dt>
                        <dd>{(data.evaluationQuestions || []).length} configured</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500 dark:text-gray-400">AI Screening</dt>
                        <dd>
                          <Badge variant={data.aiEvaluation ? "success" : "secondary"}>
                            {data.aiEvaluation ? "Enabled" : "Disabled"}
                          </Badge>
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500 dark:text-gray-400">Contact</dt>
                        <dd>{data.contactPerson || "—"} ({data.contactEmail || "—"})</dd>
                      </div>
                    </dl>
                  </div>

                  {data.description && (
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/30">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Description</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{data.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </Button>

              <div className="flex gap-3">
                {currentStep === steps.length - 1 ? (
                  <>
                    <Button variant="outline" onClick={saveDraft}>
                      <Save className="mr-1 h-4 w-4" /> Save as Draft
                    </Button>
                    <Button onClick={publishGrant}>
                      Publish Grant
                    </Button>
                  </>
                ) : (
                  <Button onClick={nextStep}>
                    Next <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
