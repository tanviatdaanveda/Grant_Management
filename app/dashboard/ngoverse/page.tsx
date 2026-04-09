"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { FocusArea } from "@/types";
import {
  getNGOverseProfiles,
  shortlistNGO,
  type NGOverseCard,
} from "@/lib/actions";
import {
  Search,
  Star,
  Users,
  FileCheck,
  Eye,
  Send,
  Globe,
  MapPin,
  CheckCircle2,
  XCircle,
  BarChart3,
  Database,
} from "lucide-react";

const FOCUS_AREAS: FocusArea[] = [
  "Education",
  "Health",
  "Women Empowerment",
  "Environment",
  "Livelihood",
  "Disability",
  "Child Welfare",
  "Disaster Relief",
];

const FOCUS_COLORS: Record<string, string> = {
  Education: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Health: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Women Empowerment": "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  Environment: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Livelihood: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Disability: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "Child Welfare": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Disaster Relief": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

function ScoreBadge({ score, label }: { score: number; label?: string }) {
  const color =
    score >= 75
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : score >= 50
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${color}`}>
      {label && <span className="font-medium">{label}</span>}
      {Math.round(score)}
    </span>
  );
}

function ImpactBar({ score }: { score: number }) {
  const w = Math.min(100, Math.max(0, score));
  const color = w >= 75 ? "bg-green-500" : w >= 50 ? "bg-amber-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${w}%` }} />
      </div>
      <span className="text-[10px] font-medium text-gray-500">{Math.round(w)}</span>
    </div>
  );
}

function DocIcon({ ready, label }: { ready: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5" title={label}>
      {ready ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <XCircle className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
      )}
      <span className="text-[8px] text-gray-400 leading-none">{label}</span>
    </div>
  );
}

export default function NGOversePage() {
  const [profiles, setProfiles] = useState<NGOverseCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);
  const [geography, setGeography] = useState("");
  const [minFitScore, setMinFitScore] = useState(0);
  const [docReady, setDocReady] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    const data = await getNGOverseProfiles({});
    setProfiles(data);
    setLoading(false);
  };

  // Client-side filtering (already fetched all)
  const filtered = useMemo(() => {
    let result = profiles;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.organization.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }
    if (selectedFocusAreas.length > 0) {
      result = result.filter((c) =>
        selectedFocusAreas.some((fa) => c.focusAreas.includes(fa))
      );
    }
    if (geography) {
      result = result.filter((c) =>
        c.geography.some((g) => g.toLowerCase().includes(geography.toLowerCase()))
      );
    }
    if (minFitScore > 0) {
      result = result.filter((c) => c.fitScore >= minFitScore);
    }
    if (docReady) {
      result = result.filter(
        (c) => c.documentReadiness.registration && c.documentReadiness.fcra
      );
    }
    return result;
  }, [profiles, search, selectedFocusAreas, geography, minFitScore, docReady]);

  // Stats
  const totalNGOs = profiles.length;
  const totalDocReady = profiles.filter(
    (c) => c.documentReadiness.registration && c.documentReadiness.fcra
  ).length;
  const totalShortlisted = profiles.filter((c) => c.isShortlisted).length;

  const handleShortlist = async (userId: string) => {
    const card = profiles.find((c) => c.userId === userId);
    if (!card) return;
    const newVal = !card.isShortlisted;
    setProfiles((prev) =>
      prev.map((c) => (c.userId === userId ? { ...c, isShortlisted: newVal } : c))
    );
    await shortlistNGO(userId, newVal);
  };

  const toggleFocusArea = (fa: string) => {
    setSelectedFocusAreas((prev) =>
      prev.includes(fa) ? prev.filter((x) => x !== fa) : [...prev, fa]
    );
  };

  return (
    <>
      <Header title="NGOverse" />
      <main className="p-6 lg:p-8 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Globe className="h-6 w-6 text-indigo-600" />
            NGOverse
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Discover and shortlist NGOs for your grant programs
          </p>
        </div>

        {/* Filter Bar */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search NGOs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Geography */}
              <Select value={geography} onChange={(e) => setGeography(e.target.value)}>
                <option value="">All Geographies</option>
                <option value="National">National</option>
                <option value="State">State</option>
                <option value="City">City</option>
              </Select>

              {/* Min Fit Score */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-500">Min Fit Score</Label>
                  <span className="text-xs font-medium text-indigo-600">{minFitScore}</span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  value={minFitScore}
                  onValueChange={setMinFitScore}
                />
              </div>

              {/* Doc Ready */}
              <div className="flex items-center gap-2">
                <Switch
                  checked={docReady}
                  onCheckedChange={setDocReady}
                  id="doc-ready"
                />
                <Label htmlFor="doc-ready" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  Document Ready Only
                </Label>
              </div>
            </div>

            {/* Focus Area pills */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-400 self-center mr-1">Focus:</span>
              {FOCUS_AREAS.map((fa) => (
                <button
                  key={fa}
                  onClick={() => toggleFocusArea(fa)}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-all border ${
                    selectedFocusAreas.includes(fa)
                      ? "border-indigo-400 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-600"
                      : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-600 dark:text-gray-400"
                  }`}
                >
                  {fa}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <Database className="h-4 w-4 text-indigo-500" />
            <span className="font-semibold text-gray-900 dark:text-white">{totalNGOs}</span> NGOs in database
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <FileCheck className="h-4 w-4 text-green-500" />
            <span className="font-semibold text-gray-900 dark:text-white">{totalDocReady}</span> Document Ready
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <Star className="h-4 w-4 text-amber-500" />
            <span className="font-semibold text-gray-900 dark:text-white">{totalShortlisted}</span> Shortlisted
          </div>
        </div>

        {/* NGO Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No NGOs match your filters</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((ngo) => (
              <Card key={ngo.userId} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {ngo.organization || ngo.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">{ngo.orgType}</p>
                    </div>
                    <button
                      onClick={() => handleShortlist(ngo.userId)}
                      className="ml-2 flex-shrink-0"
                      title={ngo.isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
                    >
                      <Star
                        className={`h-5 w-5 transition-colors ${
                          ngo.isShortlisted
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300 hover:text-amber-400 dark:text-gray-600"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Focus Areas */}
                  <div className="flex flex-wrap gap-1">
                    {ngo.focusAreas.slice(0, 3).map((fa) => (
                      <span
                        key={fa}
                        className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${
                          FOCUS_COLORS[fa] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {fa}
                      </span>
                    ))}
                    {ngo.focusAreas.length > 3 && (
                      <span className="text-[9px] text-gray-400">+{ngo.focusAreas.length - 3}</span>
                    )}
                  </div>

                  {/* Geography */}
                  {ngo.geography.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3 w-3" />
                      {ngo.geography.slice(0, 2).join(", ")}
                    </div>
                  )}

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2 text-center rounded-lg bg-gray-50 dark:bg-gray-700/20 p-2.5">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{ngo.totalApps}</p>
                      <p className="text-[9px] text-gray-400">Applications</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">{ngo.approvedApps}</p>
                      <p className="text-[9px] text-gray-400">Approved</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{ngo.approvalRate}%</p>
                      <p className="text-[9px] text-gray-400">Approval Rate</p>
                    </div>
                  </div>

                  {/* AI Fit Score + Impact */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-gray-400 mb-1">AI Fit Score</p>
                      <ScoreBadge score={ngo.fitScore} />
                    </div>
                    <div className="flex-1 ml-4">
                      <p className="text-[9px] text-gray-400 mb-1">Impact Score</p>
                      <ImpactBar score={ngo.impactScore} />
                    </div>
                  </div>

                  {/* Document Readiness */}
                  <div>
                    <p className="text-[9px] text-gray-400 mb-1.5">Document Readiness</p>
                    <div className="flex gap-3">
                      <DocIcon ready={ngo.documentReadiness.registration} label="Reg" />
                      <DocIcon ready={ngo.documentReadiness.fcra} label="FCRA" />
                      <DocIcon ready={ngo.documentReadiness.annual_report} label="Annual" />
                      <DocIcon ready={ngo.documentReadiness.proposal} label="Prop" />
                      <DocIcon ready={ngo.documentReadiness.budget} label="Budget" />
                      <DocIcon ready={ngo.documentReadiness.impact} label="Impact" />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Link href={`/dashboard/ngoverse/${ngo.userId}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        <Eye className="mr-1 h-3 w-3" /> View Profile
                      </Button>
                    </Link>
                    <Link href={`/dashboard/ngoverse/${ngo.userId}?tab=invite`} className="flex-1">
                      <Button size="sm" className="w-full text-xs">
                        <Send className="mr-1 h-3 w-3" /> Invite to Grant
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
