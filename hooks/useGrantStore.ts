"use client";

import { useState, useEffect, useCallback } from "react";
import { Grant } from "@/types";
import * as storage from "@/lib/storage";

export function useGrantStore() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setGrants(storage.getGrants());
    setLoading(false);
  }, []);

  const refresh = useCallback(() => {
    setGrants(storage.getGrants());
  }, []);

  const saveGrant = useCallback(
    (grant: Grant) => {
      storage.saveGrant(grant);
      refresh();
    },
    [refresh]
  );

  const deleteGrant = useCallback(
    (id: string) => {
      storage.deleteGrant(id);
      refresh();
    },
    [refresh]
  );

  return { grants, loading, saveGrant, deleteGrant, refresh };
}
