"use client";

import { useState } from "react";
import Link from "next/link";
import { Application, Grant, ApplicationStatus } from "@/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { updateApplicationStatus } from "@/lib/actions";
import { formatCurrency } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  MapPin,
  Phone,
  Building2,
  FileText,
  Check,
  Globe,
  Minus,
} from "lucide-react";

// ─── SVG Circular Score ───
function CircularScore({ score, size = 80, strokeWidth = 8 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "text-green-500" : score >= 50 ? "text-amber-500" : "text-red-500";
  const bg = score >= 75 ? "text-green-100 dark:text-green-900/40" : score >= 50 ? "text-amber-100 dark:text-amber-900/40" : "text-red-100 dark:text-red-900/40";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none" className={`stroke-current ${bg}`} />
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} className={`stroke-current ${color} transition-all duration-500`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-lg font-bold ${color}`}>{Math.round(score)}</span>
        <span className="text-[8px] text-gray-400">/ 100</span>
      </div>
    </div>
  );
}

const STATUS_BADGE: Record<string, "success" | "secondary" | "destructive" | "default"> = {
  Submitted: "default",
  "In Review": "secondary",
  Shortlisted: "default",
  Approved: "success",
  Rejected: "destructive",
};

interface ApplicationDrawerProps {
  application: Application | null;
  grant: Grant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (appId: string, newStatus: ApplicationStatus) => void;
}

export function ApplicationDrawer({ application, grant, open, onOpenChange, onStatusChange }: ApplicationDrawerProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  if (!application) return null;

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    setUpdating(newStatus);
    try {
      await updateApplicationStatus(application.id, newStatus);
      onStatusChange(application.id, newStatus);
    } catch {
      // ignore
    } finally {
      setUpdating(null);
    }
  };

  const status = application.status;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" onClose={() => onOpenChange(false)} className="flex flex-col">
        {/* Header */}
        <SheetHeader className="pr-10">
          <div className="flex items-center gap-2 mt-2">
            <SheetTitle className="text-base">{application.ngoName}</SheetTitle>
            <Badge variant={STATUS_BADGE[status] || "default"}>{status}</Badge>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Application {application.id}
          </p>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Section 1: NGO Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">NGO Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Building2 className="h-3.5 w-3.5 text-gray-400" />
                {application.ngoName}
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <FileText className="h-3.5 w-3.5 text-gray-400" />
                Reg: {application.ngoRegistration}
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                {application.ngoLocation}
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                {application.ngoContact}
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                {application.ngoEmail}
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 2: Project Proposal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Project Proposal</h4>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Project Title</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{application.projectTitle}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Description</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{application.projectDescription}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Target Beneficiaries</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{application.targetBeneficiaries.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Timeline</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{application.implementationTimeline}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 3: Budget */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Budget</h4>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 dark:bg-gray-700/30">
                  <tr>
                    <th className="text-left p-2 font-medium text-gray-500">Category</th>
                    <th className="text-right p-2 font-medium text-gray-500">Amount</th>
                    <th className="text-left p-2 font-medium text-gray-500">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {application.budgetItems.map((item) => (
                    <tr key={item.id} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="p-2 text-gray-700 dark:text-gray-300">{item.category || "—"}</td>
                      <td className="p-2 text-right font-medium text-gray-900 dark:text-white">{formatCurrency(item.amount)}</td>
                      <td className="p-2 text-gray-500 dark:text-gray-400">{item.description || "—"}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30">
                    <td className="p-2 font-semibold text-gray-900 dark:text-white">Total</td>
                    <td className="p-2 text-right font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(application.totalBudget)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <Separator />

          {/* Section 4: Evaluation Responses */}
          {application.evaluationResponses.length > 0 && (
            <>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Evaluation Responses</h4>
                <div className="space-y-3">
                  {application.evaluationResponses.map((er) => (
                    <div key={er.questionId} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/30">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{er.question}</p>
                      <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{er.answer || <span className="text-gray-400 italic">No response</span>}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Section 5: Documents */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Documents</h4>
            <div className="space-y-2">
              {application.documents.map((doc) => (
                <div key={doc.name} className="flex items-center gap-2 text-sm">
                  {doc.status === "Uploaded" ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Minus className="h-4 w-4 text-gray-300" />
                  )}
                  <span className={doc.status === "Uploaded" ? "text-gray-700 dark:text-gray-300" : "text-gray-400"}>
                    {doc.name}
                  </span>
                  {doc.fileName && (
                    <span className="text-[10px] text-gray-400 ml-auto">{doc.fileName}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Section 6: AI Score */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">AI Score</h4>
            <div className="flex items-center gap-4">
              <CircularScore score={application.score} />
              <div className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                <p>Score calculated based on profile completeness, focus area alignment, and eligibility match.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer — Action Buttons */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          <Link href="/dashboard/ngoverse" className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 mb-2">
            <Globe className="h-3 w-3" /> Find NGOs in NGOverse
          </Link>
          <div className="flex flex-wrap gap-2">
            {status === "Submitted" && (
              <>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleStatusChange("In Review")} disabled={updating !== null}>
                  {updating === "In Review" ? <Clock className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Clock className="mr-1 h-3.5 w-3.5" />}
                  Move to Review
                </Button>
                <Button size="sm" variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400" onClick={() => handleStatusChange("Rejected")} disabled={updating !== null}>
                  <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                </Button>
              </>
            )}
            {status === "In Review" && (
              <>
                <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={() => handleStatusChange("Shortlisted")} disabled={updating !== null}>
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Shortlist
                </Button>
                <Button size="sm" variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400" onClick={() => handleStatusChange("Rejected")} disabled={updating !== null}>
                  <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                </Button>
              </>
            )}
            {status === "Shortlisted" && (
              <>
                <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange("Approved")} disabled={updating !== null}>
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Approve
                </Button>
                <Button size="sm" variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400" onClick={() => handleStatusChange("Rejected")} disabled={updating !== null}>
                  <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                </Button>
              </>
            )}
            {(status === "Approved" || status === "Rejected") && (
              <Button size="sm" variant="outline" className="flex-1" onClick={() => window.open(`mailto:${application.ngoEmail}`)}>
                <Mail className="mr-1 h-3.5 w-3.5" /> Email NGO
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
