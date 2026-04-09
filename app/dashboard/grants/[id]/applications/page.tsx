"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicationDrawer } from "@/components/dashboard/ApplicationDrawer";
import { Grant, Application, ApplicationStatus } from "@/types";
import {
  getGrant,
  getApplicationsByGrant,
  updateApplicationStatus,
  bulkUpdateApplicationStatus,
} from "@/lib/actions";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Eye,
  ThumbsUp,
  X,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";

const TABS: { label: string; status: ApplicationStatus | "All" }[] = [
  { label: "All", status: "All" },
  { label: "Submitted", status: "Submitted" },
  { label: "In Review", status: "In Review" },
  { label: "Shortlisted", status: "Shortlisted" },
  { label: "Approved", status: "Approved" },
  { label: "Rejected", status: "Rejected" },
];

const STATUS_BADGE: Record<string, "success" | "secondary" | "destructive" | "default"> = {
  Submitted: "default",
  "In Review": "secondary",
  Shortlisted: "default",
  Approved: "success",
  Rejected: "destructive",
};

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 75
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : score >= 50
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${color}`}>
      {score}
    </span>
  );
}

export default function GrantApplicationsPage() {
  const params = useParams();
  const grantId = params.id as string;

  const [grant, setGrant] = useState<Grant | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ApplicationStatus | "All">("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawerApp, setDrawerApp] = useState<Application | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    Promise.all([getGrant(grantId), getApplicationsByGrant(grantId)]).then(
      ([g, apps]) => {
        if (g) setGrant(g);
        setApplications(apps);
        setLoading(false);
      }
    );
  }, [grantId]);

  // Stats
  const stats = useMemo(() => {
    const s = { total: 0, submitted: 0, inReview: 0, shortlisted: 0, approved: 0, rejected: 0 };
    for (const a of applications) {
      s.total++;
      if (a.status === "Submitted") s.submitted++;
      else if (a.status === "In Review") s.inReview++;
      else if (a.status === "Shortlisted") s.shortlisted++;
      else if (a.status === "Approved") s.approved++;
      else if (a.status === "Rejected") s.rejected++;
    }
    return s;
  }, [applications]);

  const tabCounts = useMemo(() => {
    const c: Record<string, number> = { All: applications.length };
    for (const a of applications) c[a.status] = (c[a.status] || 0) + 1;
    return c;
  }, [applications]);

  const filtered = activeTab === "All" ? applications : applications.filter((a) => a.status === activeTab);

  // Selection helpers
  const allSelected = filtered.length > 0 && filtered.every((a) => selected.has(a.id));
  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((a) => a.id)));
    }
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  // Status change helpers
  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
    // Also update the drawer app if open
    if (drawerApp?.id === appId) {
      setDrawerApp((prev) => (prev ? { ...prev, status: newStatus } : prev));
    }
  };

  const handleQuickAction = async (appId: string, newStatus: ApplicationStatus) => {
    await updateApplicationStatus(appId, newStatus);
    handleStatusChange(appId, newStatus);
  };

  const handleBulkAction = async (status: ApplicationStatus) => {
    const ids = Array.from(selected);
    await bulkUpdateApplicationStatus(ids, status);
    setApplications((prev) =>
      prev.map((a) => (ids.includes(a.id) ? { ...a, status } : a))
    );
    setSelected(new Set());
  };

  const openDrawer = (app: Application) => {
    setDrawerApp(app);
    setDrawerOpen(true);
  };

  if (loading) {
    return (
      <>
        <Header title="Applications" />
        <main className="p-6 lg:p-8 space-y-4">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Applications" />
      <main className="p-6 lg:p-8 space-y-6">
        {/* Page Header */}
        <div>
          <Link
            href="/dashboard/grants"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to My Grants
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {grant?.title || "Grant"}
            </h1>
            {grant && (
              <Badge
                variant={
                  grant.status === "Active"
                    ? "success"
                    : grant.status === "Draft"
                    ? "secondary"
                    : "destructive"
                }
              >
                {grant.status}
              </Badge>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
                <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-xs text-gray-500">Total Applications</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.submitted + stats.inReview}</p>
                <p className="text-xs text-gray-500">Under Review</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.shortlisted}</p>
                <p className="text-xs text-gray-500">Shortlisted</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/40">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved}</p>
                <p className="text-xs text-gray-500">Approved</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.status}
              onClick={() => { setActiveTab(tab.status); setSelected(new Set()); }}
              className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.status
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-[10px] rounded-full bg-gray-100 px-1.5 py-0.5 dark:bg-gray-700">
                {tabCounts[tab.status] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Bulk Action Bar */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 rounded-lg bg-indigo-50 px-4 py-3 dark:bg-indigo-900/20">
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-400">
              {selected.size} selected
            </span>
            <div className="flex gap-2 ml-auto">
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("In Review")}>
                Move to Review
              </Button>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => handleBulkAction("Shortlisted")}>
                Shortlist Selected
              </Button>
              <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400" onClick={() => handleBulkAction("Rejected")}>
                Reject Selected
              </Button>
            </div>
          </div>
        )}

        {/* Applications Table */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No applications in this category</p>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 overflow-hidden dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/30">
                <tr>
                  <th className="w-10 p-3">
                    <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                  </th>
                  <th className="text-left p-3 font-medium text-gray-500">NGO Name</th>
                  <th className="text-left p-3 font-medium text-gray-500">Project Title</th>
                  <th className="text-left p-3 font-medium text-gray-500">Submitted</th>
                  <th className="text-center p-3 font-medium text-gray-500">AI Score</th>
                  <th className="text-center p-3 font-medium text-gray-500">Status</th>
                  <th className="text-center p-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/20 cursor-pointer transition-colors"
                    onClick={(e) => {
                      // Don't open drawer if clicking a button/checkbox
                      if ((e.target as HTMLElement).closest("button, input, label")) return;
                      openDrawer(app);
                    }}
                  >
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.has(app.id)}
                        onCheckedChange={() => toggleOne(app.id)}
                      />
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-gray-900 dark:text-white">{app.ngoName}</p>
                      <p className="text-xs text-gray-400">{app.ngoLocation}</p>
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                      {app.projectTitle}
                    </td>
                    <td className="p-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(app.submittedAt)}
                    </td>
                    <td className="p-3 text-center">
                      <ScoreBadge score={app.score} />
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant={STATUS_BADGE[app.status] || "default"}>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openDrawer(app)}
                          className="rounded p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {app.status !== "Shortlisted" && app.status !== "Approved" && (
                          <button
                            onClick={() => handleQuickAction(app.id, "Shortlisted")}
                            className="rounded p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                            title="Shortlist"
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </button>
                        )}
                        {app.status !== "Rejected" && (
                          <button
                            onClick={() => handleQuickAction(app.id, "Rejected")}
                            className="rounded p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Application Drawer */}
      <ApplicationDrawer
        application={drawerApp}
        grant={grant}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
