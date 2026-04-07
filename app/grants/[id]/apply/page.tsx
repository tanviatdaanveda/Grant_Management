"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Grant, Application, BudgetItem } from "@/types";
import { getGrant, saveApplication, addActivity, initializeStorage } from "@/lib/storage";
import { formatCurrency, formatDate, generateId } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  Save,
} from "lucide-react";
import Image from "next/image";

const mockProfile = {
  ngoName: "Hope Initiative India",
  ngoRegistration: "NGO-784521",
  ngoLocation: "Bengaluru, Karnataka",
  ngoContact: "+91 9876543210",
  ngoEmail: "priya@hopeinitiative.org",
};

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const [grant, setGrant] = useState<Grant | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [targetBeneficiaries, setTargetBeneficiaries] = useState<number>(0);
  const [implementationTimeline, setImplementationTimeline] = useState("");
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: generateId(), category: "", amount: 0, description: "" },
  ]);
  const [evalResponses, setEvalResponses] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [appId, setAppId] = useState("");

  useEffect(() => {
    initializeStorage();
    const g = getGrant(params.id as string);
    if (g) setGrant(g);
  }, [params.id]);

  const totalBudget = budgetItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const budgetValid = !grant || totalBudget <= grant.maxAmount;

  const addBudgetItem = () => {
    setBudgetItems([...budgetItems, { id: generateId(), category: "", amount: 0, description: "" }]);
  };

  const updateBudgetItem = (index: number, field: keyof BudgetItem, value: string | number) => {
    const items = [...budgetItems];
    items[index] = { ...items[index], [field]: value };
    setBudgetItems(items);
  };

  const removeBudgetItem = (index: number) => {
    setBudgetItems(budgetItems.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!grant) return;

    const newAppId = `APP-${Date.now().toString(36).toUpperCase()}`;
    const application: Application = {
      id: newAppId,
      grantId: grant.id,
      grantTitle: grant.title,
      ngoName: mockProfile.ngoName,
      ngoRegistration: mockProfile.ngoRegistration,
      ngoLocation: mockProfile.ngoLocation,
      ngoContact: mockProfile.ngoContact,
      ngoEmail: mockProfile.ngoEmail,
      projectTitle,
      projectDescription,
      targetBeneficiaries,
      implementationTimeline,
      budgetItems,
      totalBudget,
      evaluationResponses: (grant.evaluationQuestions || []).map((q) => ({
        questionId: q.id,
        question: q.question,
        answer: evalResponses[q.id] || "",
      })),
      documents: [
        { name: "Registration Certificate", status: "Uploaded", fileName: "registration_cert.pdf" },
        { name: "Annual Report", status: "Uploaded", fileName: "annual_report_2025.pdf" },
        { name: "Project Plan", status: "Pending" },
        { name: "Budget Document", status: "Uploaded", fileName: "budget.xlsx" },
      ],
      status: "Submitted",
      score: 0,
      submittedAt: new Date().toISOString(),
      notes: [],
    };

    saveApplication(application);
    addActivity({
      id: `act-${Date.now()}`,
      type: "application_received",
      message: `New application from ${mockProfile.ngoName} for ${grant.title}`,
      timestamp: new Date().toISOString(),
    });

    setAppId(newAppId);
    setShowConfirm(true);
  };

  if (!grant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500">Loading grant...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-icon.png" alt="DaanVeda" width={32} height={32} className="h-8 w-8" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">DaanVeda</span>
          </Link>
          <Link href={`/grants/${grant.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to Grant
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Grant Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-5 space-y-3">
                <div>
                  <Badge variant={grant.status === "Active" ? "success" : "secondary"}>{grant.status}</Badge>
                  <h3 className="mt-2 font-semibold text-gray-900 dark:text-white">{grant.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{grant.funderName}</p>
                </div>
                <Separator />
                <div className="text-sm space-y-1.5 text-gray-600 dark:text-gray-400">
                  <p className="font-medium text-lg text-gray-900 dark:text-white">{formatCurrency(grant.totalAmount)}</p>
                  <p className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(grant.endDate)}</p>
                  <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {grant.geography === "National" ? "Pan India" : grant.state}</p>
                </div>
                <Separator />
                <div className="flex flex-wrap gap-1">
                  {grant.focusAreas.map((a) => (
                    <Badge key={a} variant="default" className="text-[10px]">{a}</Badge>
                  ))}
                </div>
                <Separator />
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p className="font-medium mb-1">Eligibility</p>
                  <p className="line-clamp-4">{grant.eligibilityCriteria}</p>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Application Form */}
          <main className="flex-1 space-y-6 pb-24">
            {/* Section 1: Organization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Section 1 — Organization Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>NGO Name</Label>
                  <Input value={mockProfile.ngoName} disabled className="mt-1 bg-gray-50 dark:bg-gray-700" />
                </div>
                <div>
                  <Label>Registration Number</Label>
                  <Input value={mockProfile.ngoRegistration} disabled className="mt-1 bg-gray-50 dark:bg-gray-700" />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input value={mockProfile.ngoLocation} disabled className="mt-1 bg-gray-50 dark:bg-gray-700" />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input value={mockProfile.ngoEmail} disabled className="mt-1 bg-gray-50 dark:bg-gray-700" />
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Project Proposal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Section 2 — Project Proposal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="projTitle">Project Title *</Label>
                  <Input
                    id="projTitle"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g., Digital Literacy for Rural Schools"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="projDesc">Project Description *</Label>
                  <Textarea
                    id="projDesc"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe your project in detail..."
                    rows={5}
                    className="mt-1"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="beneficiaries">Target Beneficiaries</Label>
                    <Input
                      id="beneficiaries"
                      type="number"
                      value={targetBeneficiaries || ""}
                      onChange={(e) => setTargetBeneficiaries(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeline">Implementation Timeline</Label>
                    <Input
                      id="timeline"
                      value={implementationTimeline}
                      onChange={(e) => setImplementationTimeline(e.target.value)}
                      placeholder="e.g., 12 months"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Budget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Section 3 — Budget</CardTitle>
                <Button variant="outline" size="sm" onClick={addBudgetItem}>
                  <Plus className="mr-1 h-3 w-3" /> Add Item
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {budgetItems.map((item, i) => (
                    <div key={item.id} className="flex gap-3 items-start">
                      <div className="flex-1 grid gap-2 sm:grid-cols-3">
                        <Input
                          placeholder="Category"
                          value={item.category}
                          onChange={(e) => updateBudgetItem(i, "category", e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Amount (₹)"
                          value={item.amount || ""}
                          onChange={(e) => updateBudgetItem(i, "amount", Number(e.target.value))}
                        />
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateBudgetItem(i, "description", e.target.value)}
                        />
                      </div>
                      <button
                        onClick={() => removeBudgetItem(i)}
                        className="mt-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/30">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Budget</span>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${budgetValid ? "text-indigo-600 dark:text-indigo-400" : "text-red-600"}`}>
                      {formatCurrency(totalBudget)}
                    </span>
                    {!budgetValid && (
                      <p className="text-xs text-red-500">Exceeds max amount of {formatCurrency(grant.maxAmount)}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 4: Evaluation Questions */}
            {(grant.evaluationQuestions || []).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Section 4 — Evaluation Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {grant.evaluationQuestions.map((q) => (
                    <div key={q.id}>
                      <Label className="text-sm">{q.question}</Label>
                      <p className="text-xs text-gray-400 mb-1">
                        {q.responseType} · Max Score: {q.maxScore} · Weightage: {q.weightage}%
                      </p>
                      <Textarea
                        value={evalResponses[q.id] || ""}
                        onChange={(e) =>
                          setEvalResponses({ ...evalResponses, [q.id]: e.target.value })
                        }
                        placeholder="Your answer..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Section 5: Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Section 5 — Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Registration Certificate", "Annual Report", "Project Plan", "Budget Document"].map((doc) => (
                    <div
                      key={doc}
                      className="flex items-center justify-between rounded-lg border border-dashed border-gray-300 p-3 dark:border-gray-600"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">{doc}</span>
                      <Button variant="outline" size="sm">
                        <Upload className="mr-1 h-3 w-3" /> Upload
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur px-6 py-4 dark:border-gray-700 dark:bg-gray-800/95">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Budget: <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(totalBudget)}</span>
          </p>
          <div className="flex gap-3">
            <Button variant="outline">
              <Save className="mr-1 h-4 w-4" /> Save Draft
            </Button>
            <Button onClick={handleSubmit} disabled={!projectTitle || !projectDescription}>
              Submit Application
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Application Submitted!
            </DialogTitle>
            <DialogDescription>
              Your application has been successfully submitted.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Application ID: <span className="font-mono font-semibold text-green-700 dark:text-green-400">{appId}</span>
            </p>
            <p className="text-sm text-gray-700 mt-1 dark:text-gray-300">
              Grant: <span className="font-medium">{grant.title}</span>
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => router.push("/grants")}>
              Browse More Grants
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
