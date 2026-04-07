"use client";

import { NgoSidebar } from "@/components/layout/NgoSidebar";
import { useEffect } from "react";
import { initializeStorage } from "@/lib/storage";

export default function NgoDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NgoSidebar />
      <div className="lg:pl-60">
        {children}
      </div>
    </div>
  );
}
