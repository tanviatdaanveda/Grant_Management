"use client";

import { useState, useEffect, useCallback } from "react";
import { Application, ApplicationStatus } from "@/types";
import * as actions from "@/lib/actions";

export function useApplicationStore() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await actions.getApplications();
    setApplications(data);
  }, []);

  useEffect(() => {
    refresh().then(() => setLoading(false));
  }, [refresh]);

  const saveApplication = useCallback(
    async (app: Application) => {
      await actions.saveApplication(app);
      await refresh();
    },
    [refresh]
  );

  const updateStatus = useCallback(
    async (id: string, status: ApplicationStatus) => {
      await actions.updateApplicationStatus(id, status);
      await refresh();
    },
    [refresh]
  );

  const bulkUpdateStatus = useCallback(
    async (ids: string[], status: ApplicationStatus) => {
      await actions.bulkUpdateApplicationStatus(ids, status);
      await refresh();
    },
    [refresh]
  );

  return { applications, loading, saveApplication, updateStatus, bulkUpdateStatus, refresh };
}
