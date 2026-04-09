"use client";

import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/lib/store";
import {
  getKnowledgeDocuments,
  uploadKnowledgeDocument,
  updateKnowledgeDocExtractedData,
  deleteKnowledgeDocument,
  aiExtractDocumentData,
  type KnowledgeDoc,
} from "@/lib/actions";
import {
  Upload,
  FileText,
  CheckCircle2,
  Brain,
  Loader2,
  Trash2,
  AlertCircle,
  Shield,
  BookOpen,
  TrendingUp,
  DollarSign,
  FileCheck,
  Users,
  Building2,
} from "lucide-react";

const DOC_TYPES = [
  { key: "registration", label: "Registration Certificate", icon: Shield, color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/40" },
  { key: "fcra", label: "FCRA Certificate", icon: FileCheck, color: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/40" },
  { key: "annual_report", label: "Annual Report", icon: BookOpen, color: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/40" },
  { key: "impact", label: "Impact Report", icon: TrendingUp, color: "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/40" },
  { key: "budget", label: "Budget Document", icon: DollarSign, color: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/40" },
  { key: "proposal", label: "Previous Proposal", icon: FileText, color: "text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/40" },
  { key: "leadership", label: "Leadership Info", icon: Users, color: "text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-900/40" },
  { key: "profile", label: "Organization Profile", icon: Building2, color: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/40" },
] as const;

const PROFILE_FIELDS = [
  { key: "orgName", label: "Organization Name" },
  { key: "registrationNo", label: "Registration Number" },
  { key: "fcraNo", label: "FCRA Number" },
  { key: "mission", label: "Mission" },
  { key: "vision", label: "Vision" },
  { key: "focusAreas", label: "Focus Areas" },
  { key: "geography", label: "Geography" },
  { key: "foundedYear", label: "Founded Year" },
  { key: "teamSize", label: "Team Size" },
  { key: "annualBudget", label: "Annual Budget" },
  { key: "contactPerson", label: "Contact Person" },
  { key: "contactEmail", label: "Contact Email" },
];

export default function KnowledgeHubPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState<Record<string, boolean>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const refresh = async () => {
    if (!currentUser) return;
    const data = await getKnowledgeDocuments(currentUser.id);
    setDocs(data);
  };

  useEffect(() => {
    if (currentUser) {
      refresh().then(() => setLoading(false));
    }
  }, [currentUser]);

  const getDocForType = (type: string) => docs.find((d) => d.fileType === type);

  const mergedProfile = (() => {
    const merged: Record<string, string> = {};
    for (const doc of docs) {
      for (const [k, v] of Object.entries(doc.extractedData)) {
        if (v && !merged[k]) merged[k] = v;
      }
    }
    return merged;
  })();

  const filledCount = Object.values(mergedProfile).filter(Boolean).length;

  const handleUpload = async (fileType: string, file: File) => {
    if (!currentUser) return;

    setExtracting((p) => ({ ...p, [fileType]: true }));

    try {
      // Read file text
      const text = await file.text();

      // Save document record
      const docId = await uploadKnowledgeDocument(
        currentUser.id,
        file.name,
        fileType,
        `local://${file.name}` // In production this would be a real URL
      );

      // Extract data with AI (server action)
      const extracted = await aiExtractDocumentData(text, fileType);

      // Save extracted data
      await updateKnowledgeDocExtractedData(docId, extracted);

      await refresh();
    } catch (err) {
      console.error("Upload/extract failed:", err);
    } finally {
      setExtracting((p) => ({ ...p, [fileType]: false }));
    }
  };

  const handleDelete = async (docId: string) => {
    await deleteKnowledgeDocument(docId);
    await refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Knowledge Hub" />
        <main className="p-6 max-w-6xl mx-auto space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Knowledge Hub" />
      <main className="p-6 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/40">
              <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Knowledge Hub</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upload your organization documents. AI will extract and reuse data across all your grant applications.
              </p>
            </div>
          </div>
        </div>

        {/* Document Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DOC_TYPES.map(({ key, label, icon: Icon, color }) => {
            const doc = getDocForType(key);
            const isExtracting = extracting[key];

            return (
              <Card key={key} className="relative overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {doc && (
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove document"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                    {doc ? (
                      <div className="mt-1 space-y-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{doc.fileName}</p>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="success" className="text-[10px] px-1.5 py-0">
                            <CheckCircle2 className="mr-0.5 h-2.5 w-2.5" /> Uploaded
                          </Badge>
                          {Object.keys(doc.extractedData).length > 0 && (
                            <Badge className="text-[10px] px-1.5 py-0 bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400">
                              <Brain className="mr-0.5 h-2.5 w-2.5" /> AI Extracted
                            </Badge>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Not uploaded</p>
                    )}
                  </div>

                  {isExtracting ? (
                    <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Extracting with AI...
                    </div>
                  ) : (
                    <>
                      <input
                        ref={(el) => { fileRefs.current[key] = el; }}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(key, file);
                          e.target.value = "";
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => fileRefs.current[key]?.click()}
                      >
                        <Upload className="mr-1 h-3 w-3" />
                        {doc ? "Replace" : "Upload"}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Extracted Profile Data */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Extracted Profile Data
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {filledCount} / {PROFILE_FIELDS.length} fields
              </Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Data extracted by AI from your uploaded documents. This will be auto-filled in grant applications.
            </p>
          </CardHeader>
          <CardContent>
            {filledCount === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No data extracted yet. Upload documents above to get started.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {PROFILE_FIELDS.map(({ key, label }) => (
                  <div key={key} className="rounded-lg border border-gray-100 p-3 dark:border-gray-700">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      {label}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-900 dark:text-white truncate">
                      {mergedProfile[key] || (
                        <span className="text-gray-300 dark:text-gray-600 italic">—</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
