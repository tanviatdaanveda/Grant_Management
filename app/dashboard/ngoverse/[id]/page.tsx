"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Application, Grant } from "@/types";
import {
  getNGOFullProfile,
  shortlistNGO,
  inviteNGOToGrant,
  getGrants,
  type NGOFullProfile,
} from "@/lib/actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Star,
  MapPin,
  Mail,
  Phone,
  Globe,
  Users,
  CheckCircle2,
  BarChart3,
  FileText,
  Send,
  Calendar,
  Building2,
  Target,
  Award,
  Briefcase,
} from "lucide-react";

const STATUS_BADGE: Record<string, "success" | "secondary" | "destructive" | "default" | "warning" | "info"> = {
  Submitted: "info",
  "In Review": "secondary",
  Shortlisted: "default",
  Approved: "success",
  Rejected: "destructive",
  Active: "success",
  Draft: "secondary",
  Closed: "destructive",
};

const TABS = ["Overview", "Grant History", "Applications", "Documents"] as const;
type Tab = (typeof TABS)[number];

function CircularScore({ score, size = 72 }: { score: number; size?: number }) {
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "text-green-500" : score >= 50 ? "text-amber-500" : "text-red-500";
  const bg = score >= 75 ? "text-green-100 dark:text-green-900/40" : score >= 50 ? "text-amber-100 dark:text-amber-900/40" : "text-red-100 dark:text-red-900/40";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none" className={`stroke-current ${bg}`} />
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} className={`stroke-current ${color} transition-all duration-500`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-lg font-bold ${color}`}>{Math.round(score)}</span>
        <span className="text-[7px] text-gray-400">/ 100</span>
      </div>
    </div>
  );
}

export default function NGOProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const ngoId = params.id as string;

  const [profile, setProfile] = useState<NGOFullProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>(
    searchParams.get("tab") === "invite" ? "Overview" : "Overview"
  );
  const [notes, setNotes] = useState("");
  const [grants, setGrants] = useState<Grant[]>([]);
  const [selectedGrantId, setSelectedGrantId] = useState("");
  const [inviting, setInviting] = useState(false);
  const [invited, setInvited] = useState(false);

  useEffect(() => {
    Promise.all([getNGOFullProfile(ngoId), getGrants()]).then(([p, g]) => {
      setProfile(p);
      setGrants(g.filter((gr) => gr.status === "Active"));
      setLoading(false);
    });
  }, [ngoId]);

  const handleShortlist = async () => {
    if (!profile) return;
    const newVal = !profile.isShortlisted;
    setProfile({ ...profile, isShortlisted: newVal });
    await shortlistNGO(profile.userId, newVal);
  };

  const handleInvite = async () => {
    if (!selectedGrantId || !profile) return;
    setInviting(true);
    await inviteNGOToGrant(profile.userId, selectedGrantId);
    setInviting(false);
    setInvited(true);
    setTimeout(() => setInvited(false), 3000);
  };

  if (loading) {
    return (
      <>
        <Header title="NGO Profile" />
        <main className="p-6 lg:p-8 space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </main>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Header title="NGO Profile" />
        <main className="p-6 lg:p-8">
          <p className="text-gray-500">NGO not found</p>
          <Link href="/dashboard/ngoverse">
            <Button variant="outline" className="mt-4"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Button>
          </Link>
        </main>
      </>
    );
  }

  // Unique grants from applications for grant history
  const grantHistory = new Map<string, { grantId: string; grantTitle: string; status: string; totalBudget: number; submittedAt: string }>();
  for (const app of profile.applications) {
    const existing = grantHistory.get(app.grantId);
    if (!existing || app.status === "Approved") {
      grantHistory.set(app.grantId, {
        grantId: app.grantId,
        grantTitle: app.grantTitle,
        status: app.status,
        totalBudget: app.totalBudget,
        submittedAt: app.submittedAt,
      });
    }
  }

  return (
    <>
      <Header title="NGO Profile" />
      <main className="p-6 lg:p-8 space-y-6">
        {/* Back link + header */}
        <div>
          <Link href="/dashboard/ngoverse" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-3">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to NGOverse
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{profile.organization || profile.name}</h1>
                <Badge variant={profile.registrationNo ? "success" : "secondary"}>
                  {profile.registrationNo ? "Registered NGO" : "Community Org"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                {(profile.city || profile.state) && (
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {[profile.city, profile.state].filter(Boolean).join(", ")}</span>
                )}
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {profile.email}</span>
                {profile.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {profile.phone}</span>}
              </div>
            </div>
            <button onClick={handleShortlist} title={profile.isShortlisted ? "Remove from shortlist" : "Shortlist"}>
              <Star className={`h-6 w-6 transition-colors ${profile.isShortlisted ? "fill-amber-400 text-amber-400" : "text-gray-300 hover:text-amber-400"}`} />
            </button>
          </div>
        </div>

        {/* Stat Cards + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - 3 cols */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
                    <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile.totalApps}</p>
                    <p className="text-xs text-gray-500">Total Applications</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/40">
                    <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile.approvalRate}%</p>
                    <p className="text-xs text-gray-500">Approval Rate</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
                    <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(profile.grantsReceived)}</p>
                    <p className="text-xs text-gray-500">Grants Received</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40">
                    <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(profile.impactScore)}</p>
                    <p className="text-xs text-gray-500">Impact Score</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tab Bar */}
            <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "Overview" && (
              <div className="space-y-6">
                {/* Mission */}
                {profile.mission && (
                  <Card>
                    <CardHeader><CardTitle className="text-sm">Mission Statement</CardTitle></CardHeader>
                    <CardContent className="-mt-2">
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{profile.mission}</p>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Focus Areas */}
                  <Card>
                    <CardHeader><CardTitle className="text-sm">Focus Areas</CardTitle></CardHeader>
                    <CardContent className="-mt-2 flex flex-wrap gap-1.5">
                      {profile.focusAreas.length > 0 ? (
                        profile.focusAreas.map((fa) => (
                          <Badge key={fa} variant="default">{fa}</Badge>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400">Not specified</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Org Details */}
                  <Card>
                    <CardHeader><CardTitle className="text-sm">Organization Details</CardTitle></CardHeader>
                    <CardContent className="-mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Registration No</span>
                        <span className="font-medium text-gray-900 dark:text-white">{profile.registrationNo || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">FCRA No</span>
                        <span className="font-medium text-gray-900 dark:text-white">{profile.fcraNo || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Founded Year</span>
                        <span className="font-medium text-gray-900 dark:text-white">{profile.foundedYear ?? "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Team Size</span>
                        <span className="font-medium text-gray-900 dark:text-white">{profile.teamSize ?? "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Annual Budget</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {profile.annualBudget ? formatCurrency(profile.annualBudget) : "—"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Geography */}
                {profile.geography.length > 0 && (
                  <Card>
                    <CardHeader><CardTitle className="text-sm">Operating Geographies</CardTitle></CardHeader>
                    <CardContent className="-mt-2 flex flex-wrap gap-1.5">
                      {profile.geography.map((g) => (
                        <Badge key={g} variant="secondary">{g}</Badge>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "Grant History" && (
              <Card>
                <CardContent className="p-0">
                  {grantHistory.size === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">No grant history</p>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700/30">
                        <tr>
                          <th className="text-left p-3 font-medium text-gray-500">Grant</th>
                          <th className="text-center p-3 font-medium text-gray-500">Status</th>
                          <th className="text-right p-3 font-medium text-gray-500">Budget</th>
                          <th className="text-right p-3 font-medium text-gray-500">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {Array.from(grantHistory.values()).map((gh) => (
                          <tr key={gh.grantId} className="hover:bg-gray-50 dark:hover:bg-gray-700/20">
                            <td className="p-3 text-gray-900 dark:text-white font-medium">{gh.grantTitle}</td>
                            <td className="p-3 text-center">
                              <Badge variant={STATUS_BADGE[gh.status] || "default"}>{gh.status}</Badge>
                            </td>
                            <td className="p-3 text-right text-gray-700 dark:text-gray-300">{formatCurrency(gh.totalBudget)}</td>
                            <td className="p-3 text-right text-gray-500">{formatDate(gh.submittedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "Applications" && (
              <Card>
                <CardContent className="p-0">
                  {profile.applications.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">No applications yet</p>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700/30">
                        <tr>
                          <th className="text-left p-3 font-medium text-gray-500">Project Title</th>
                          <th className="text-left p-3 font-medium text-gray-500">Grant</th>
                          <th className="text-center p-3 font-medium text-gray-500">Score</th>
                          <th className="text-center p-3 font-medium text-gray-500">Status</th>
                          <th className="text-right p-3 font-medium text-gray-500">Submitted</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {profile.applications.map((app) => (
                          <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20">
                            <td className="p-3 text-gray-900 dark:text-white font-medium max-w-[200px] truncate">{app.projectTitle}</td>
                            <td className="p-3 text-gray-700 dark:text-gray-300">{app.grantTitle}</td>
                            <td className="p-3 text-center">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                app.score >= 75
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : app.score >= 50
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              }`}>
                                {Math.round(app.score)}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <Badge variant={STATUS_BADGE[app.status] || "default"}>{app.status}</Badge>
                            </td>
                            <td className="p-3 text-right text-gray-500">{formatDate(app.submittedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "Documents" && (
              <div className="space-y-4">
                {profile.documents.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <FileText className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">No documents uploaded</p>
                    </CardContent>
                  </Card>
                ) : (
                  profile.documents.map((doc) => (
                    <Card key={doc.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{doc.fileName}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Type: {doc.fileType.replace(/_/g, " ")} · Uploaded {formatDate(doc.uploadedAt)}
                            </p>
                          </div>
                          <Badge variant="info">{doc.fileType.replace(/_/g, " ")}</Badge>
                        </div>
                        {Object.keys(doc.extractedData).length > 0 && (
                          <>
                            <Separator className="my-3" />
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase mb-2">AI Extracted Data</p>
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(doc.extractedData).slice(0, 6).map(([key, val]) => (
                                  <div key={key} className="rounded bg-gray-50 dark:bg-gray-700/20 p-2">
                                    <p className="text-[10px] text-gray-400">{key.replace(/_/g, " ")}</p>
                                    <p className="text-xs text-gray-700 dark:text-gray-300 truncate">{val}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>

          {/* ─── Right Sidebar ─── */}
          <div className="space-y-4">
            {/* AI Fit Score Card */}
            <Card>
              <CardContent className="p-5 flex flex-col items-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">AI Fit Score</p>
                <CircularScore score={profile.fitScore} />
                <p className="text-[10px] text-gray-400 mt-2 text-center">
                  Based on profile completeness, focus alignment, and document readiness
                </p>
              </CardContent>
            </Card>

            {/* Invite to Grant */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Invite to Grant</p>
                <Select
                  value={selectedGrantId}
                  onChange={(e) => setSelectedGrantId(e.target.value)}
                >
                  <option value="">Select a grant...</option>
                  {grants.map((g) => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </Select>
                <Button
                  className="w-full"
                  size="sm"
                  disabled={!selectedGrantId || inviting}
                  onClick={handleInvite}
                >
                  {inviting ? "Sending..." : invited ? "Invitation Sent!" : <><Send className="mr-1 h-3.5 w-3.5" /> Send Invitation</>}
                </Button>
              </CardContent>
            </Card>

            {/* Shortlist Toggle */}
            <Card>
              <CardContent className="p-5">
                <Button
                  variant={profile.isShortlisted ? "outline" : "default"}
                  className="w-full"
                  size="sm"
                  onClick={handleShortlist}
                >
                  <Star className={`mr-1 h-3.5 w-3.5 ${profile.isShortlisted ? "fill-amber-400 text-amber-400" : ""}`} />
                  {profile.isShortlisted ? "Remove from Shortlist" : "Add to Shortlist"}
                </Button>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Notes</p>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes about this NGO..."
                  rows={4}
                  className="text-sm"
                />
                <Button variant="outline" size="sm" className="w-full" onClick={() => {}}>
                  Save Note
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
