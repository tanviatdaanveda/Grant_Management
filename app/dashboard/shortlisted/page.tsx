"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ApplicationDrawer } from "@/components/dashboard/ApplicationDrawer";
import { Application } from "@/types";
import { getApplications, updateApplicationStatus } from "@/lib/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ShortlistedPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerApp, setDrawerApp] = useState<Application | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const refresh = () => getApplications().then((all) => setApplications(all.filter((a) => a.status === "Shortlisted")));

  useEffect(() => {
    refresh().then(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, status: Application["status"]) => {
    await updateApplicationStatus(id, status);
    await refresh();
    if (drawerApp?.id === id) setDrawerApp({ ...drawerApp, status });
  };

  if (loading) {
    return (
      <>
        <Header title="Shortlisted" />
        <main className="p-6 lg:p-8 space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Shortlisted" />
      <main className="p-6 lg:p-8">
        <div className="space-y-3">
          {applications.map((app) => (
            <Card key={app.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setDrawerApp(app); setDrawerOpen(true); }}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{app.ngoName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{app.grantTitle}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Budget: {formatCurrency(app.totalBudget)} · Submitted: {formatDate(app.submittedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-purple-600">{app.score}</span>
                  <StatusBadge status={app.status} />
                  <Button size="sm" variant="success" onClick={(e) => { e.stopPropagation(); handleStatusChange(app.id, "Approved"); }}>
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {applications.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">No shortlisted applications yet.</div>
          )}
        </div>
      </main>
      <ApplicationDrawer application={drawerApp} grant={null} open={drawerOpen} onOpenChange={setDrawerOpen} onStatusChange={handleStatusChange} />
    </>
  );
}
