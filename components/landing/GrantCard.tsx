"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Grant } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

interface GrantCardProps {
  grant: Grant;
}

export function GrantCard({ grant }: GrantCardProps) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg hover:border-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-600/50">
      {/* Status indicator */}
      <div className="flex items-start justify-between mb-3">
        <Badge
          variant={
            grant.status === "Active"
              ? "success"
              : grant.status === "Draft"
              ? "secondary"
              : "destructive"
          }
        >
          {grant.status}
        </Badge>
        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
          {grant.grantType}
        </span>
      </div>

      {/* Title & Funder */}
      <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors dark:text-white dark:group-hover:text-indigo-400">
        {grant.title}
      </h3>
      <p className="text-sm text-gray-500 mb-3 dark:text-gray-400">{grant.funderName}</p>

      {/* Amount */}
      <div className="mb-3">
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {formatCurrency(grant.totalAmount)}
        </span>
        <span className="text-xs text-gray-500 ml-1 dark:text-gray-400">total fund</span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDate(grant.endDate)}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {grant.geography === "National"
            ? "Pan India"
            : grant.state || grant.city || grant.geography}
        </span>
      </div>

      {/* Focus Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {grant.focusAreas.map((area) => (
          <span
            key={area}
            className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          >
            {area}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-auto">
        <Link href={`/grants/${grant.id}`}>
          <Button variant="outline" size="sm" className="w-full group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200 dark:group-hover:bg-indigo-900/30 dark:group-hover:text-indigo-400 dark:group-hover:border-indigo-600/50">
            Apply Now <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
