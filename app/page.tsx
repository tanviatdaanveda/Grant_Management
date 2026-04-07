"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { GrantCard } from "@/components/landing/GrantCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Grant, FocusArea } from "@/types";
import { getGrants, initializeStorage } from "@/lib/storage";
import { Zap, Search } from "lucide-react";

const focusAreas: FocusArea[] = [
  "Education", "Health", "Women Empowerment", "Environment",
  "Livelihood", "Disability", "Child Welfare", "Disaster Relief",
];

export default function Home() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [search, setSearch] = useState("");
  const [focusFilter, setFocusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [geoFilter, setGeoFilter] = useState("");

  useEffect(() => {
    initializeStorage();
    setGrants(getGrants());
  }, []);

  const filtered = grants.filter((g) => {
    if (search && !g.title.toLowerCase().includes(search.toLowerCase()) && !g.funderName.toLowerCase().includes(search.toLowerCase())) return false;
    if (focusFilter && !g.focusAreas.includes(focusFilter as FocusArea)) return false;
    if (typeFilter && g.grantType !== typeFilter) return false;
    if (geoFilter && g.geography !== geoFilter) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">DaanVeda</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/grants" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors dark:text-gray-400 dark:hover:text-indigo-400">
              Browse Grants
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors dark:text-gray-400 dark:hover:text-indigo-400">
              For Funders
            </Link>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors dark:text-gray-400 dark:hover:text-indigo-400">
              How it Works
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <HeroSection />

      {/* Grant Discovery */}
      <section className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Discover Grants</h2>
          <p className="text-gray-500 mt-1 dark:text-gray-400">Find the right funding opportunity for your organization</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search grants or funders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={focusFilter} onChange={(e) => setFocusFilter(e.target.value)}>
            <option value="">All Focus Areas</option>
            {focusAreas.map((a) => <option key={a} value={a}>{a}</option>)}
          </Select>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All Grant Types</option>
            {["CSR", "Government", "Foundation", "Corporate", "Bilateral"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
          <Select value={geoFilter} onChange={(e) => setGeoFilter(e.target.value)}>
            <option value="">All Geographies</option>
            {["National", "State", "City"].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </Select>
        </div>

        {/* Grant Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((grant) => (
            <GrantCard key={grant.id} grant={grant} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No grants match your filters. Try adjusting your search criteria.
          </div>
        )}
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="bg-gray-50 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12 dark:text-white">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create or Browse", description: "Funders publish grant opportunities. NGOs discover and filter relevant grants." },
              { step: "02", title: "Apply & Evaluate", description: "NGOs submit applications. AI-powered screening evaluates and scores submissions automatically." },
              { step: "03", title: "Fund & Track", description: "Approve top applicants, disburse funds, and track impact with real-time dashboards." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600 mb-4 dark:bg-indigo-900 dark:text-indigo-400">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">DaanVeda</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2026 DaanVeda. All rights reserved. Built for India&apos;s social sector.</p>
        </div>
      </footer>
    </div>
  );
}
