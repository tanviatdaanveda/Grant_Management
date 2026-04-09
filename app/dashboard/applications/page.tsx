"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ApplicationDrawer } from "@/components/dashboard/ApplicationDrawer";
import { Application, ApplicationStatus } from "@/types";
import { getApplications, updateApplicationStatus, bulkUpdateApplicationStatus } from "@/lib/actions";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Search, Download, Star, XCircle } from "lucide-react";

const tabs: { label: string; status: ApplicationStatus | "All" }[] = [
  { label: "All", status: "All" },
  { label: "Submitted", status: "Submitted" },
  { label: "In Review", status: "In Review" },
  { label: "Shortlisted", status: "Shortlisted" },
  { label: "Approved", status: "Approved" },
  { label: "Rejected", status: "Rejected" },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<ApplicationStatus | "All">("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawerApp, setDrawerApp] = useState<Application | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const refresh = () => {
    getApplications().then(setApplications);
  };

  useEffect(() => {
    getApplications().then((data) => {
      setApplications(data);
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

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      if (activeTab !== "All" && app.status !== activeTab) return false;
      if (
        search &&
        !app.ngoName.toLowerCase().includes(search.toLowerCase()) &&
        !app.grantTitle.toLowerCase().includes(search.toLowerCase()) &&
        !app.projectTitle.toLowerCase().includes(search.toLowerCase()) &&
        !app.status.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [applications, activeTab, search]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { All: applications.length };
    applications.forEach((app) => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });
    return counts;
  }, [applications]);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((a) => a.id)));
    }
  };

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    await updateApplicationStatus(id, status);
    refresh();
    if (drawerApp?.id === id) {
      setDrawerApp({ ...drawerApp, status });
    }
  };

  const handleBulkAction = async (status: ApplicationStatus) => {
    await bulkUpdateApplicationStatus(Array.from(selected), status);
    setSelected(new Set());
    refresh();
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
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Applications" />
      <main className="p-6 lg:p-8">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search NGOs, grants, projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-6 bg-gray-100 rounded-lg p-1 dark:bg-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.status}
              onClick={() => { setActiveTab(tab.status); setSelected(new Set()); }}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                activeTab === tab.status
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              )}
            >
              {tab.label}{" "}
              <span className="ml-1 text-xs text-gray-400">({tabCounts[tab.status] || 0})</span>
            </button>
          ))}
        </div>

        {/* Bulk Actions */}
        {selected.size > 0 && (
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-indigo-50 p-3 dark:bg-indigo-900/20">
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-400">
              {selected.size} selected
            </span>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("Shortlisted")}>
              <Star className="mr-1 h-3 w-3" /> Shortlist Selected
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("Rejected")}>
              <XCircle className="mr-1 h-3 w-3" /> Reject Selected
            </Button>
            <Button size="sm" variant="outline">
              <Download className="mr-1 h-3 w-3" /> Export CSV
            </Button>
          </div>
        )}

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <Checkbox
                        checked={selected.size === filtered.length && filtered.length > 0}
                        onCheckedChange={toggleAll}
                      />
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">NGO Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Grant</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell">Submitted</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Score</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filtered.map((app) => (
                    <tr
                      key={app.id}
                      className="group hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-800/50"
                      onClick={() => openDrawer(app)}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selected.has(app.id)}
                          onCheckedChange={() => toggleSelect(app.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 dark:text-white">{app.ngoName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{app.ngoLocation}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell max-w-[200px] truncate dark:text-gray-400">
                        {app.grantTitle}
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell dark:text-gray-400">
                        {formatDate(app.submittedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "font-semibold",
                            app.score >= 80
                              ? "text-green-600"
                              : app.score >= 60
                              ? "text-amber-600"
                              : "text-red-600"
                          )}
                        >
                          {app.score}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100"
                          onClick={() => openDrawer(app)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  No applications found matching your criteria.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <ApplicationDrawer
        application={drawerApp}
        grant={null}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
