"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Search,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { getApplications, getGrants } from "@/lib/actions";
import { useAppStore } from "@/lib/store";
import { Application, Grant } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  Submitted: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400", icon: FileText },
  "In Review": { color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", icon: Clock },
  Shortlisted: { color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400", icon: Star },
  Approved: { color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400", icon: CheckCircle },
  Rejected: { color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400", icon: XCircle },
};

export default function NgoDashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useAppStore((s) => s.currentUser);

  useEffect(() => {
    Promise.all([getApplications(), getGrants()]).then(([allApps, allGrants]) => {
      const ngoApps = currentUser?.role === "ngo_user" ? allApps : [];
      setApplications(ngoApps);
      setGrants(allGrants.filter((g) => g.status === "Active"));
      setLoading(false);
    });
  }, [currentUser]);

  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      icon: FileText,
      color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-400",
    },
    {
      label: "Under Review",
      value: applications.filter((a) => a.status === "Submitted" || a.status === "In Review").length,
      icon: Clock,
      color: "text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400",
    },
    {
      label: "Shortlisted",
      value: applications.filter((a) => a.status === "Shortlisted").length,
      icon: Star,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-400",
    },
    {
      label: "Approved",
      value: applications.filter((a) => a.status === "Approved").length,
      icon: CheckCircle,
      color: "text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-400",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Dashboard" />
        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen">
      <Header title="Dashboard" />
      <main className="p-6 space-y-6">
        {/* Welcome */}
        <div className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
          <h2 className="text-xl font-bold">Welcome back, {currentUser?.name?.split(" ")[0] || "there"}!</h2>
          <p className="mt-1 text-orange-100">
            Track your applications and discover new funding opportunities.
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/ngo-dashboard/grants">
              <Button variant="secondary" size="sm" className="bg-white/20 text-white hover:bg-white/30 border-0">
                <Search className="h-4 w-4 mr-1" />
                Browse Grants
              </Button>
            </Link>
            <Link href="/ngo-dashboard/applications">
              <Button variant="secondary" size="sm" className="bg-white/20 text-white hover:bg-white/30 border-0">
                <FileText className="h-4 w-4 mr-1" />
                My Applications
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                    </div>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Recent Applications</CardTitle>
                <Link href="/ngo-dashboard/applications">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-10 w-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">No applications yet</p>
                    <Link href="/ngo-dashboard/grants">
                      <Button variant="outline" size="sm" className="mt-3">
                        Browse Grants
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentApplications.map((app) => {
                      const cfg = statusConfig[app.status];
                      const StatusIcon = cfg?.icon || FileText;
                      return (
                        <div
                          key={app.id}
                          className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-700"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                              {app.grantTitle}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {app.projectTitle} • {formatCurrency(app.totalBudget)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${cfg?.color || ""}`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {app.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Open Grants */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Open Grants</CardTitle>
              <Link href="/ngo-dashboard/grants">
                <Button variant="ghost" size="sm">
                  See All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {grants.slice(0, 4).map((grant) => (
                  <Link
                    key={grant.id}
                    href={`/grants/${grant.id}`}
                    className="block rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-700/30"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{grant.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{grant.funderName}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                        {formatCurrency(grant.totalAmount)}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        Due {formatDate(grant.endDate)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Success Rate */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Application Insights</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Your application performance overview</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {applications.length > 0
                    ? Math.round(
                        (applications.filter((a) => a.status === "Approved").length / applications.length) * 100
                      )
                    : 0}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Approval Rate</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {applications.length > 0
                    ? Math.round(applications.reduce((sum, a) => sum + a.score, 0) / applications.length)
                    : 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg Score</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(
                    applications
                      .filter((a) => a.status === "Approved")
                      .reduce((sum, a) => sum + a.totalBudget, 0)
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Funds Secured</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {applications.filter((a) => a.status !== "Rejected").length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Active Apps</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
