"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Grant } from "@/types";
import { getGrants, getApplicationStatsForGrants, type ApplicationStats } from "@/lib/actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Search, FileText, Calendar, MapPin, Users } from "lucide-react";

export default function GrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [stats, setStats] = useState<Record<string, ApplicationStats>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getGrants().then(async (data) => {
      setGrants(data);
      if (data.length > 0) {
        const s = await getApplicationStatsForGrants(data.map((g) => g.id));
        setStats(s);
      }
      setLoading(false);
    });
  }, []);

  // Listen for header search events
  useEffect(() => {
    const handler = (e: Event) => {
      setSearch((e as CustomEvent).detail || "");
    };
    window.addEventListener("dv:search", handler);
    return () => window.removeEventListener("dv:search", handler);
  }, []);

  const filtered = grants.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.funderName.toLowerCase().includes(search.toLowerCase()) ||
      g.status.toLowerCase().includes(search.toLowerCase()) ||
      g.grantType.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Header title="My Grants" />
        <main className="p-6 lg:p-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="My Grants" />
      <main className="p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search grants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Link href="/dashboard/grants/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Grant
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {filtered.map((grant) => {
            const s = stats[grant.id] || { total: 0, submitted: 0, inReview: 0, shortlisted: 0, approved: 0, rejected: 0 };
            return (
              <Card key={grant.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-indigo-500" />
                        <Link
                          href={`/dashboard/grants/${grant.id}/applications`}
                          className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors dark:text-white dark:hover:text-indigo-400"
                        >
                          {grant.title}
                        </Link>
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
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{grant.funderName}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Deadline: {formatDate(grant.endDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />{" "}
                          {grant.geography === "National" ? "Pan India" : grant.state || grant.geography}
                        </span>
                      </div>

                      {/* Application Stats */}
                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {s.total} Applications
                        </span>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <span className="font-medium text-purple-600 dark:text-purple-400">
                          {s.shortlisted} Shortlisted
                        </span>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {s.approved} Approved
                        </span>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          {s.rejected} Rejected
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(grant.totalAmount)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{grant.grantType}</p>
                      <Link href={`/dashboard/grants/${grant.id}/applications`}>
                        <Button size="sm" variant="outline" className="mt-1">
                          <Users className="mr-1 h-3.5 w-3.5" /> View Applications
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No grants found. Create your first grant to get started.
            </div>
          )}
        </div>
      </main>
    </>
  );
}
