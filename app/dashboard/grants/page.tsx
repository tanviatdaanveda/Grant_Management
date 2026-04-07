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
import { getGrants } from "@/lib/storage";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Search, FileText, Calendar, MapPin } from "lucide-react";

export default function GrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setGrants(getGrants());
    setLoading(false);
  }, []);

  const filtered = grants.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.funderName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Header title="My Grants" />
        <main className="p-6 lg:p-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
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
          {filtered.map((grant) => (
            <Card key={grant.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-indigo-500" />
                      <Link
                        href={`/grants/${grant.id}`}
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
                      <span>Applications: {grant.applications}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(grant.totalAmount)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{grant.grantType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

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
