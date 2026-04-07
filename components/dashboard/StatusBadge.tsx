"use client";

import { ApplicationStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<ApplicationStatus, { variant: "info" | "warning" | "purple" | "success" | "destructive"; label: string }> = {
  Submitted: { variant: "info", label: "Submitted" },
  "In Review": { variant: "warning", label: "In Review" },
  Shortlisted: { variant: "purple", label: "Shortlisted" },
  Approved: { variant: "success", label: "Approved" },
  Rejected: { variant: "destructive", label: "Rejected" },
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
