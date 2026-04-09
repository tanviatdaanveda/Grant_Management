"use client";

import { useState, useEffect, useCallback } from "react";
import { Grant } from "@/types";
import * as actions from "@/lib/actions";

export function useGrantStore() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await actions.getGrants();
    setGrants(data);
  }, []);

  useEffect(() => {
    refresh().then(() => setLoading(false));
  }, [refresh]);

  const saveGrant = useCallback(
    async (grant: Grant) => {
      await actions.saveGrant(grant);
      await refresh();
    },
    [refresh]
  );

  const deleteGrant = useCallback(
    async (id: string) => {
      await actions.deleteGrant(id);
      await refresh();
    },
    [refresh]
  );

  return { grants, loading, saveGrant, deleteGrant, refresh };
}
