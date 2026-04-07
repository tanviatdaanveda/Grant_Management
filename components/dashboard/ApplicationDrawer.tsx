"use client";

import { Application } from "@/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MapPin, FileText, CheckCircle, XCircle, Star, Eye } from "lucide-react";
import { useState } from "react";

interface ApplicationDrawerProps {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: Application["status"]) => void;
}

export function ApplicationDrawer({
  application,
  open,
  onOpenChange,
  onStatusChange,
}: ApplicationDrawerProps) {
  const [note, setNote] = useState("");

  if (!application) return null;

  const scoreColor =
    application.score >= 80
      ? "text-green-600"
      : application.score >= 60
      ? "text-amber-600"
      : "text-red-600";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" onClose={() => onOpenChange(false)} className="overflow-y-auto">
        <SheetHeader className="pr-8">
          <div className="flex items-center gap-2">
            <SheetTitle>{application.ngoName}</SheetTitle>
            <StatusBadge status={application.status} />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {application.ngoRegistration} · <MapPin className="inline h-3 w-3" /> {application.ngoLocation}
          </p>
        </SheetHeader>

        <div className="p-6 space-y-6">
          {/* Score Widget */}
          <div className="flex items-center justify-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-gray-200 dark:border-gray-700">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${application.score * 2.64} ${264 - application.score * 2.64}`}
                  className={scoreColor}
                />
              </svg>
              <span className={`text-2xl font-bold ${scoreColor}`}>{application.score}</span>
            </div>
          </div>

          <Separator />

          {/* Grant Info */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Grant Applied For</h4>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{application.grantTitle}</p>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Project</h4>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{application.projectTitle}</p>
            <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">{application.projectDescription}</p>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Beneficiaries: {application.targetBeneficiaries.toLocaleString("en-IN")}</span>
              <span className="mx-2">·</span>
              <span>Timeline: {application.implementationTimeline}</span>
            </div>
          </div>

          <Separator />

          {/* Budget */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Budget Breakdown</h4>
            <div className="rounded-lg border border-gray-200 overflow-hidden dark:border-gray-700">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Category</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {application.budgetItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{item.category}</td>
                      <td className="px-3 py-2 text-right text-gray-900 dark:text-white">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold dark:bg-gray-700/50">
                    <td className="px-3 py-2 text-gray-900 dark:text-white">Total</td>
                    <td className="px-3 py-2 text-right text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(application.totalBudget)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Evaluation Responses */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Evaluation Responses</h4>
            <div className="space-y-3">
              {application.evaluationResponses.map((r) => (
                <div key={r.questionId} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/30">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{r.question}</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{r.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Documents</h4>
            <div className="space-y-2">
              {application.documents.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{doc.name}</span>
                  </div>
                  <Badge
                    variant={doc.status === "Uploaded" ? "success" : doc.status === "Pending" ? "warning" : "secondary"}
                  >
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Add Note</h4>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add internal notes about this application..."
              rows={3}
            />
            <Button size="sm" variant="outline" className="mt-2" onClick={() => setNote("")}>
              Save Note
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(application.id, "In Review")}
              disabled={application.status === "In Review"}
            >
              <Eye className="mr-1 h-3 w-3" /> Move to Review
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/30"
              onClick={() => onStatusChange(application.id, "Shortlisted")}
              disabled={application.status === "Shortlisted"}
            >
              <Star className="mr-1 h-3 w-3" /> Shortlist
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => onStatusChange(application.id, "Approved")}
              disabled={application.status === "Approved"}
            >
              <CheckCircle className="mr-1 h-3 w-3" /> Approve
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onStatusChange(application.id, "Rejected")}
              disabled={application.status === "Rejected"}
            >
              <XCircle className="mr-1 h-3 w-3" /> Reject
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
