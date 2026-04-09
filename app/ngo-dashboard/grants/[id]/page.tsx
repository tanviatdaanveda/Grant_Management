"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import { Grant } from "@/types";
import {
  getGrant,
  getOrCalculateFitScore,
  recalculateFitScore,
  type FitScoreData,
} from "@/lib/actions";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  Target,
  Phone,
  Mail,
  RefreshCw,
  Loader2,
  Lightbulb,
  Brain,
} from "lucide-react";

// ─── SVG Circular Progress ───
function CircularScore({ score, size = 120, strokeWidth = 10 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 75 ? "text-green-500" : score >= 50 ? "text-amber-500" : "text-red-500";
  const bgColor =
    score >= 75 ? "text-green-100 dark:text-green-900/40" : score >= 50 ? "text-amber-100 dark:text-amber-900/40" : "text-red-100 dark:text-red-900/40";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className={`stroke-current ${bgColor}`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`stroke-current ${color} transition-all duration-700`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${color}`}>{Math.round(score)}</span>
        <span className="text-[10px] text-gray-500 dark:text-gray-400">/ 100</span>
      </div>
    </div>
  );
}

// ─── Breakdown Row ───
const BREAKDOWN_LABELS: { key: keyof Pick<FitScoreData, "geoScore" | "focusScore" | "eligScore" | "impactScore" | "docScore">; label: string; max: number }[] = [
  { key: "geoScore", label: "Geography Match", max: 20 },
  { key: "focusScore", label: "Focus Area Match", max: 25 },
  { key: "eligScore", label: "Eligibility Match", max: 25 },
  { key: "impactScore", label: "Past Impact", max: 15 },
  { key: "docScore", label: "Profile Completeness", max: 15 },
];

export default function NgoGrantDetailPage() {
  const params = useParams();
  const currentUser = useAppStore((s) => s.currentUser);
  const [grant, setGrant] = useState<Grant | null>(null);
  const [fitScore, setFitScore] = useState<FitScoreData | null>(null);
  const [scoreLoading, setScoreLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    getGrant(id).then((g) => { if (g) setGrant(g); });
  }, [params.id]);

  useEffect(() => {
    if (!currentUser || !grant) return;
    setScoreLoading(true);
    getOrCalculateFitScore(currentUser.id, grant.id)
      .then(setFitScore)
      .catch(() => {})
      .finally(() => setScoreLoading(false));
  }, [currentUser, grant]);

  const handleRecalculate = async () => {
    if (!currentUser || !grant) return;
    setRecalculating(true);
    try {
      const result = await recalculateFitScore(currentUser.id, grant.id);
      setFitScore(result);
    } catch {
      // ignore
    } finally {
      setRecalculating(false);
    }
  };

  if (!grant) {
    return (
      <div className="min-h-screen">
        <Header title="Grant Details" />
        <main className="p-6 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Grant Details" />
      <main className="p-6 max-w-6xl mx-auto">
        {/* Back link */}
        <Link href="/ngo-dashboard/grants" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 mb-6">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Grants
        </Link>

        {/* Grant Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={grant.status === "Active" ? "success" : grant.status === "Draft" ? "secondary" : "destructive"}>
              {grant.status}
            </Badge>
            <Badge variant="outline">{grant.grantType}</Badge>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 dark:text-white">{grant.title}</h1>
          <p className="text-gray-500 dark:text-gray-400">by {grant.funderName}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>About this Grant</CardTitle></CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap dark:text-gray-300">{grant.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Eligibility Criteria</CardTitle></CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap dark:text-gray-300">{grant.eligibilityCriteria}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Expected Outcomes</CardTitle></CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap dark:text-gray-300">{grant.expectedOutcomes}</p>
              </CardContent>
            </Card>

            {grant.evaluationQuestions.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Evaluation Criteria</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {grant.evaluationQuestions.map((q, i) => (
                      <div key={q.id} className="flex items-start gap-3 text-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600 dark:bg-orange-900 dark:text-orange-400">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-gray-700 dark:text-gray-300">{q.question}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {q.responseType} · Max Score: {q.maxScore} · Weightage: {q.weightage}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Fit Score Card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    Your Fit Score
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[10px] px-2"
                    onClick={handleRecalculate}
                    disabled={recalculating || scoreLoading}
                  >
                    {recalculating ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <RefreshCw className="h-3 w-3 mr-1" />
                    )}
                    Recalculate
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {scoreLoading ? (
                  <div className="flex flex-col items-center py-6 gap-3">
                    <Skeleton className="h-[120px] w-[120px] rounded-full" />
                    <Skeleton className="h-4 w-32" />
                    <div className="w-full space-y-2 mt-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-6 w-full" />
                      ))}
                    </div>
                  </div>
                ) : fitScore ? (
                  <div className="space-y-4">
                    {/* Circular Progress */}
                    <div className="flex justify-center py-2">
                      <CircularScore score={fitScore.totalScore} />
                    </div>

                    {/* Breakdown Table */}
                    <div className="space-y-2">
                      {BREAKDOWN_LABELS.map(({ key, label, max }) => {
                        const val = fitScore[key];
                        const pct = (val / max) * 100;
                        const barColor =
                          pct >= 75 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";
                        return (
                          <div key={key}>
                            <div className="flex items-center justify-between text-xs mb-0.5">
                              <span className="text-gray-600 dark:text-gray-400">{label}</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {val} / {max}
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700">
                              <div
                                className={`h-full rounded-full ${barColor} transition-all duration-500`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Separator />

                    {/* AI Reasoning */}
                    {fitScore.reasoning && (
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                          AI Reasoning
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                          {fitScore.reasoning}
                        </p>
                      </div>
                    )}

                    {/* Recommendations */}
                    {fitScore.suggestions.length > 0 && (
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5 flex items-center gap-1">
                          <Lightbulb className="h-3 w-3" /> Recommendations
                        </p>
                        <ul className="space-y-1.5">
                          {fitScore.suggestions.map((s, i) => (
                            <li key={i} className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-1.5">
                              <span className="text-orange-500 mt-0.5">•</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 py-4 text-center">Score unavailable</p>
                )}
              </CardContent>
            </Card>

            {/* Grant Info Card */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Fund</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(grant.totalAmount)}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Min / NGO</p>
                    <p className="font-medium dark:text-white">{formatCurrency(grant.minAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Max / NGO</p>
                    <p className="font-medium dark:text-white">{formatCurrency(grant.maxAmount)}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Deadline: {formatDate(grant.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {grant.geography === "National" ? "Pan India" : `${grant.state || grant.geography}${grant.city ? `, ${grant.city}` : ""}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{grant.applications} applications</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Target className="h-4 w-4" />
                    <span>{grant.identifierType} required</span>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-gray-500 mb-1.5 dark:text-gray-400">Focus Areas</p>
                  <div className="flex flex-wrap gap-1">
                    {grant.focusAreas.map((area) => (
                      <Badge key={area} variant="default">{area}</Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="h-3 w-3" /> {grant.phone || "—"}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail className="h-3 w-3" /> {grant.contactEmail || "—"}
                  </div>
                </div>

                {grant.status === "Active" && (
                  <Link href={`/grants/${grant.id}/apply`}>
                    <Button className="w-full mt-2 bg-orange-600 hover:bg-orange-700" size="lg">
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
