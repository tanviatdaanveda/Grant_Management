"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Application } from "@/types";
import { getApplications } from "@/lib/actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

export default function ApprovedPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApplications().then((all) => {
      setApplications(all.filter((a) => a.status === "Approved"));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <>
        <Header title="Approved" />
        <main className="p-6 lg:p-8 space-y-4">
          {[1, 2].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Approved Applications" />
      <main className="p-6 lg:p-8">
        <div className="space-y-3">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{app.ngoName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{app.grantTitle}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Approved: {formatDate(app.submittedAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(app.totalBudget)}</p>
                  <Badge variant="success">Approved</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          {applications.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">No approved applications yet.</div>
          )}
        </div>
      </main>
    </>
  );
}
