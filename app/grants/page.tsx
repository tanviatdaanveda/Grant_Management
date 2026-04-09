"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GrantCard } from "@/components/landing/GrantCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Grant, FocusArea } from "@/types";
import { getGrants } from "@/lib/actions";
import { Search, ArrowLeft } from "lucide-react";
import Image from "next/image";

const focusAreas: FocusArea[] = [
  "Education", "Health", "Women Empowerment", "Environment",
  "Livelihood", "Disability", "Child Welfare", "Disaster Relief",
];

export default function BrowseGrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [search, setSearch] = useState("");
  const [focusFilter, setFocusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    getGrants().then((all) => setGrants(all.filter((g) => g.status === "Active")));
  }, []);

  const filtered = grants.filter((g) => {
    if (search && !g.title.toLowerCase().includes(search.toLowerCase()) && !g.funderName.toLowerCase().includes(search.toLowerCase())) return false;
    if (focusFilter && !g.focusAreas.includes(focusFilter as FocusArea)) return false;
    if (typeFilter && g.grantType !== typeFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-icon.png" alt="DaanVeda" width={32} height={32} className="h-8 w-8" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">DaanVeda</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-1 h-4 w-4" /> Home
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">Browse Grants</h1>
        <p className="text-gray-500 mb-6 dark:text-gray-400">Find and apply for grants that match your organization</p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search grants..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={focusFilter} onChange={(e) => setFocusFilter(e.target.value)}>
            <option value="">All Focus Areas</option>
            {focusAreas.map((a) => <option key={a} value={a}>{a}</option>)}
          </Select>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            {["CSR", "Government", "Foundation", "Corporate", "Bilateral"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((grant) => (
            <GrantCard key={grant.id} grant={grant} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">No grants match your filters.</div>
        )}
      </div>
    </div>
  );
}