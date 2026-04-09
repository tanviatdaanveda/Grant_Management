"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Search,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { getApplications } from "@/lib/actions";
import { useAppStore } from "@/lib/store";
import { Application, ApplicationStatus } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusVariant: Record<ApplicationStatus, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "purple"> = {
  Submitted: "info",
  "In Review": "warning",
  Shortlisted: "purple",
  Approved: "success",
  Rejected: "destructive",
};

const statusIcon: Record<ApplicationStatus, React.ElementType> = {
  Submitted: FileText,
  "In Review": Clock,
  Shortlisted: Star,
  Approved: CheckCircle,
  Rejected: XCircle,
};

const tabs: { label: string; value: ApplicationStatus | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Submitted", value: "Submitted" },
  { label: "In Review", value: "In Review" },
  { label: "Shortlisted", value: "Shortlisted" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

export default function NgoApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<ApplicationStatus | "All">("All");
  const currentUser = useAppStore((s) => s.currentUser);

  useEffect(() => {
    getApplications().then((allApps) => {
      const ngoApps = currentUser?.role === "ngo_user" ? allApps : [];
      setApplications(ngoApps);
      setLoading(false);
    });
  }, [currentUser]);

  const filtered = applications.filter((app) => {
    const matchesTab = activeTab === "All" || app.status === activeTab;
    const matchesSearch =
      !search ||
      app.grantTitle.toLowerCase().includes(search.toLowerCase()) ||
      app.projectTitle.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="My Applications" />
        <main className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="My Applications" />
      <main className="p-6 space-y-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const count =
              tab.value === "All"
                ? applications.length
                : applications.filter((a) => a.status === tab.value).length;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.value
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs rounded-full px-1.5 py-0.5 ${
                    activeTab === tab.value
                      ? "bg-orange-200/60 dark:bg-orange-800/40"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by grant or project title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Application Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No applications found</p>
            {applications.length === 0 && (
              <Link href="/ngo-dashboard/grants">
                <Button variant="outline" className="mt-4">
                  Browse Grants & Apply
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => {
              const Icon = statusIcon[app.status];
              return (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Left: Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {app.grantTitle}
                          </h3>
                          <Badge variant={statusVariant[app.status]}>
                            <Icon className="h-3 w-3 mr-1" />
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {app.projectTitle}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>Budget: <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(app.totalBudget)}</span></span>
                          <span>•</span>
                          <span>Submitted: {formatDate(app.submittedAt)}</span>
                          <span>•</span>
                          <span>Score: <span className="font-medium text-gray-700 dark:text-gray-300">{app.score}/100</span></span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2">
                        <Link href={`/grants/${app.grantId}`}>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            View Grant
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Progress bar for score */}
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Application Score</span>
                        <span className="font-medium">{app.score}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            app.score >= 75
                              ? "bg-green-500"
                              : app.score >= 50
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${app.score}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
