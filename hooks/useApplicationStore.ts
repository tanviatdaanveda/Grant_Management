"use client";

import { useState, useEffect, useCallback } from "react";
import { Application, ApplicationStatus } from "@/types";
import * as storage from "@/lib/storage";

export function useApplicationStore() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setApplications(storage.getApplications());
    setLoading(false);
  }, []);

  const refresh = useCallback(() => {
    setApplications(storage.getApplications());
  }, []);

  const saveApplication = useCallback(
    (app: Application) => {
      storage.saveApplication(app);
      refresh();
    },
    [refresh]
  );

  const updateStatus = useCallback(
    (id: string, status: ApplicationStatus) => {
      storage.updateApplicationStatus(id, status);
      refresh();
    },
    [refresh]
  );

  const bulkUpdateStatus = useCallback(
    (ids: string[], status: ApplicationStatus) => {
      storage.bulkUpdateApplicationStatus(ids, status);
      refresh();
    },
    [refresh]
  );

  return { applications, loading, saveApplication, updateStatus, bulkUpdateStatus, refresh };
}
