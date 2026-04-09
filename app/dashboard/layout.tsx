"use client";

import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/layout/SidebarContext";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const hydrated = useAppStore((s) => s._hydrated);

  useEffect(() => {
    if (!hydrated) return;
    if (!currentUser) { router.replace("/login"); return; }
    if (currentUser.role === "ngo_user") {
      router.replace("/ngo-dashboard");
    }
  }, [hydrated, currentUser, router]);

  if (!hydrated) return null;
  if (!currentUser || currentUser.role === "ngo_user") return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className={`transition-all duration-200 ${collapsed ? 'lg:pl-16' : 'lg:pl-60'}`}>
        {children}
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
