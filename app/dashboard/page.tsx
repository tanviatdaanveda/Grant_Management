"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Grant, Application, Activity } from "@/types";
import { getGrants, getApplications, getActivities } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import {
  Users,
  Eye,
  Star,
  CheckCircle,
  TrendingUp,
  Plus,
  FileText,
  Clock,
  ArrowUpRight,
} from "lucide-react";

export default function DashboardPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setGrants(getGrants());
    setApplications(getApplications());
    setActivities(getActivities());
    setLoading(false);
  }, []);

  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      change: "+12%",
      icon: Users,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400",
    },
    {
      label: "Under Review",
      value: applications.filter((a) => a.status === "In Review").length,
      change: "+8%",
      icon: Eye,
      color: "text-amber-600 bg-amber-100 dark:bg-amber-900/50 dark:text-amber-400",
    },
    {
      label: "Shortlisted",
      value: applications.filter((a) => a.status === "Shortlisted").length,
      change: "+15%",
      icon: Star,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/50 dark:text-purple-400",
    },
    {
      label: "Approved",
      value: applications.filter((a) => a.status === "Approved").length,
      change: "+5%",
      icon: CheckCircle,
      color: "text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-400",
    },
  ];

  const activeGrants = grants.filter((g) => g.status === "Active");

  const activityIcons: Record<Activity["type"], string> = {
    application_received: "📩",
    status_change: "🔄",
    grant_published: "📢",
    note_added: "📝",
  };

  if (loading) {
    return (
      <>
        <Header title="Dashboard" />
        <main className="p-6 lg:p-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Dashboard" />
      <main className="p-6 lg:p-8 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                      <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <div className={`rounded-lg p-2.5 ${stat.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change} vs last month
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Grants Table */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base">Active Grants</CardTitle>
              <Link href="/dashboard/grants/new">
                <Button size="sm">
                  <Plus className="mr-1 h-3 w-3" /> Create Grant
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="pb-3 text-left font-medium text-gray-500 dark:text-gray-400">Grant Name</th>
                      <th className="pb-3 text-left font-medium text-gray-500 dark:text-gray-400">Applications</th>
                      <th className="pb-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                      <th className="pb-3 text-left font-medium text-gray-500 dark:text-gray-400">Deadline</th>
                      <th className="pb-3 text-left font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {activeGrants.map((grant) => (
                      <tr key={grant.id} className="group">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                              {grant.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">{grant.applications}</td>
                        <td className="py-3">
                          <Badge variant="success">{grant.status}</Badge>
                        </td>
                        <td className="py-3 text-gray-500 dark:text-gray-400">{formatDate(grant.endDate)}</td>
                        <td className="py-3">
                          <Link href={`/grants/${grant.id}`}>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              View <ArrowUpRight className="ml-1 h-3 w-3" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.slice(0, 6).map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <span className="mt-0.5 text-base">{activityIcons[activity.type]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{activity.message}</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Ready to create a new grant?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Set up your grant in minutes with our step-by-step wizard
                </p>
              </div>
              <Link href="/dashboard/grants/new">
                <Button size="lg">
                  <Plus className="mr-2 h-4 w-4" /> Create New Grant
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}