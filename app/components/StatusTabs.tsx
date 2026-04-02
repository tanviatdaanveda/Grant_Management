"use client";

import { useState } from "react";

const mainTabs = ["Grant Management", "Shortlisted", "Approved", "Events", "Overview"];

const statusFilters = [
  { label: "Active", count: 3 },
  { label: "Draft", count: 1 },
  { label: "Closed", count: 2 },
];

interface StatusTabsProps {
  onTabChange?: (tab: string) => void;
  onStatusChange?: (status: string) => void;
  onSearch?: (query: string) => void;
}

export default function StatusTabs({ onTabChange, onStatusChange, onSearch }: StatusTabsProps) {
  const [activeTab, setActiveTab] = useState("Grant Management");
  const [activeStatus, setActiveStatus] = useState("Active");
  const [activeFilter, setActiveFilter] = useState<"Grant Status" | "Visibility Type">("Grant Status");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      {/* Main Tabs */}
      <div className="flex gap-8 border-b border-gray-200">
        {mainTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab);
              onTabChange?.(tab);
            }}
            className={`pb-3 text-base font-semibold transition-colors ${
              activeTab === tab
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search + Create */}
      <div className="mt-5 flex items-center gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch?.(e.target.value);
            }}
            className="w-full rounded-xl border border-gray-300 py-2.5 pl-9 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 transition-colors"
          />
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg bg-[#397DFF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2a6ae6] transition-colors"
        >
          Create
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>
      </div>

      {/* Filter Toggle */}
      <div className="mt-4 flex rounded-lg bg-gray-50 p-1">
        {(["Grant Status", "Visibility Type"] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${
              activeFilter === filter
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Status Tags */}
      <div className="mt-4 flex gap-4">
        {statusFilters.map((status) => (
          <button
            key={status.label}
            type="button"
            onClick={() => {
              setActiveStatus(status.label);
              onStatusChange?.(status.label);
            }}
            className={`flex items-center gap-1 text-sm transition-colors ${
              activeStatus === status.label
                ? "font-semibold text-black"
                : "font-medium text-gray-500 hover:text-gray-700"
            }`}
          >
            {status.label}
            <span className="text-[10px] text-gray-400">({status.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
