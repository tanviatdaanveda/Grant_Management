"use client";

import { NgoSidebar } from "@/components/layout/NgoSidebar";
import { SidebarProvider, useSidebar } from "@/components/layout/SidebarContext";
import { useEffect } from "react";
import { initializeStorage } from "@/lib/storage";

function NgoDashboardContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NgoSidebar />
      <div className={`transition-all duration-200 ${collapsed ? 'lg:pl-16' : 'lg:pl-60'}`}>
        {children}
      </div>
    </div>
  );
}

export default function NgoDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <NgoDashboardContent>{children}</NgoDashboardContent>
    </SidebarProvider>
  );
}
