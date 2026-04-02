"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import StatusTabs from "../components/StatusTabs";
import GrantCard from "../components/GrantCard";
import ApplicationCard from "../components/ApplicationCard";

const programData = {
  title: "The Azim Premji Foundation Grant Program",
  tags: [
    { label: "Active", color: "green" as const },
    { label: "DaanVeda only", color: "yellow" as const },
    { label: "Expiring Soon", color: "red" as const },
  ],
  applicationCount: 4791,
  shortlistedCount: 186,
};

const grants = [
  {
    id: 1,
    title: "Azim Premji Education Grant Program",
    status: "Active" as const,
    visibility: "DaanVeda only" as const,
    postDate: "6-10-2025",
    deadline: "16-10-2025",
    applicationCount: 4791,
  },
  {
    id: 2,
    title: "Azim Premji Scholarship Grant Program for young entrepreneurs",
    status: "Active" as const,
    visibility: "DaanVeda only" as const,
    postDate: "6-10-2025",
    deadline: "16-10-2025",
    applicationCount: 20,
  },
  {
    id: 3,
    title: "Azim Premji Environment Conservation Program",
    status: "Active" as const,
    visibility: "DaanVeda only" as const,
    postDate: "6-10-2025",
    deadline: "16-10-2025",
    applicationCount: 235,
  },
];

const applications = [
  {
    id: 1,
    title: "Smart Clasrooms for rural school",
    submittedDate: "10-10-2025",
    status: "Active",
    aiScore: 80,
    applicantName: "Bhumi NGO",
  },
  {
    id: 2,
    title: "Smart Clasrooms for rural school",
    submittedDate: "10-10-2025",
    status: "Active",
    aiScore: 80,
    applicantName: "Bhumi NGO",
  },
  {
    id: 3,
    title: "Smart Clasrooms for rural school",
    submittedDate: "10-10-2025",
    status: "Active",
    aiScore: 80,
    applicantName: "Bhumi NGO",
  },
];

export default function DashboardPage() {
  const [selectedGrant, setSelectedGrant] = useState(0);
  const [scoreFilter, setScoreFilter] = useState("All Scores");
  const [sortOrder] = useState("Score: High to Low");
  const [appSearch, setAppSearch] = useState("");

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Dashboard Header Banner */}
          <DashboardHeader program={programData} />

          {/* Tabs + Content */}
          <div className="mt-8 flex gap-6">
            {/* Left panel: Grant Management */}
            <div className="w-[480px] flex-none">
              <StatusTabs />

              {/* Grant Cards List */}
              <div className="mt-4 flex flex-col gap-3">
                {grants.map((grant, idx) => (
                  <button
                    key={grant.id}
                    type="button"
                    className="text-left w-full"
                    onClick={() => setSelectedGrant(idx)}
                  >
                    <GrantCard {...grant} isSelected={selectedGrant === idx} />
                  </button>
                ))}
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="w-px bg-gray-200 self-stretch" />

            {/* Right panel: Applications */}
            <div className="flex-1 min-w-0">
              {/* All Applications badge */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D0FDFA] px-3 py-1 text-xs font-medium text-[#07476E]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                    <rect x="9" y="3" width="6" height="4" rx="1" />
                  </svg>
                  All Applications
                </span>
              </div>

              {/* Search + Filters */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search"
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-2.5 pl-4 pr-10 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 transition-colors"
                  />
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Score filter dropdown */}
                <div className="relative">
                  <select
                    value={scoreFilter}
                    onChange={(e) => setScoreFilter(e.target.value)}
                    className="appearance-none rounded-xl border border-gray-300 py-2.5 pl-4 pr-10 text-sm text-gray-500 outline-none focus:border-blue-400 transition-colors"
                  >
                    <option>All Scores</option>
                    <option>High (&gt;80)</option>
                    <option>Medium (50-80)</option>
                    <option>Low (&lt;50)</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </div>

                {/* Sort order */}
                <div className="rounded-xl border border-gray-300 py-2.5 px-4 text-sm text-gray-500 whitespace-nowrap">
                  {sortOrder}
                </div>
              </div>

              {/* Application Cards */}
              <div className="mt-4 flex flex-col gap-3">
                {applications.map((app) => (
                  <ApplicationCard key={app.id} {...app} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}