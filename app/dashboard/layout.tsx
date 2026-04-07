"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { useEffect } from "react";
import { initializeStorage } from "@/lib/storage";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="lg:pl-60">
        {children}
      </div>
    </div>
  );
}
