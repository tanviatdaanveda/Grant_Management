"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  MapPin,
  Calendar,
  IndianRupee,
  ArrowRight,
  Filter,
} from "lucide-react";
import { getGrants } from "@/lib/actions";
import { Grant, FocusArea } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const focusAreas: FocusArea[] = [
  "Education",
  "Health",
  "Women Empowerment",
  "Environment",
  "Livelihood",
  "Disability",
  "Child Welfare",
  "Disaster Relief",
];

export default function NgoBrowseGrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFocus, setSelectedFocus] = useState<FocusArea | "All">("All");

  useEffect(() => {
    getGrants().then((allGrants) => {
      setGrants(allGrants.filter((g) => g.status === "Active"));
      setLoading(false);
    });
  }, []);

  // Listen for header search events
  useEffect(() => {
    const handler = (e: Event) => {
      setSearch((e as CustomEvent).detail || "");
    };
    window.addEventListener("dv:search", handler);
    return () => window.removeEventListener("dv:search", handler);
  }, []);

  const filtered = grants.filter((g) => {
    const matchesFocus =
      selectedFocus === "All" || g.focusAreas.includes(selectedFocus as FocusArea);
    const matchesSearch =
      !search ||
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.funderName.toLowerCase().includes(search.toLowerCase());
    return matchesFocus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Browse Grants" />
        <main className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Browse Grants" />
      <main className="p-6 space-y-6">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search grants or funders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <button
              onClick={() => setSelectedFocus("All")}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedFocus === "All"
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              All
            </button>
            {focusAreas.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedFocus(area)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedFocus === area
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} grant{filtered.length !== 1 ? "s" : ""} available
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No grants match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((grant) => (
              <Card key={grant.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {grant.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {grant.funderName}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2 flex-shrink-0">
                      {grant.grantType}
                    </Badge>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                    {grant.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {grant.focusAreas.map((area) => (
                      <span
                        key={area}
                        className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      >
                        {area}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {formatCurrency(grant.totalAmount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(grant.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{grant.state || "Pan India"}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/grants/${grant.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/grants/${grant.id}/apply`} className="flex-1">
                      <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
                        Apply Now <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
