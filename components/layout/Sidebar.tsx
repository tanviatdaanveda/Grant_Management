"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Star,
  CheckCircle,
  Settings,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import Image from "next/image";
import { useSidebar } from "./SidebarContext";
import { useAppStore } from "@/lib/store";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/grants", label: "My Grants", icon: FileText },
  { href: "/dashboard/applications", label: "Applications", icon: Users },
  { href: "/dashboard/shortlisted", label: "Shortlisted", icon: Star },
  { href: "/dashboard/approved", label: "Approved", icon: CheckCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { collapsed, toggle } = useSidebar();
  const currentUser = useAppStore((s) => s.currentUser);

  const initials = currentUser?.name
    ?.split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "RS";

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const sidebarContent = (full: boolean) => (
    <>
      {/* Logo */}
      <div className={cn("flex items-center gap-2 py-5", full ? "px-6" : "justify-center px-2")}>
        <Image src="/logo-icon.png" alt="DaanVeda" width={32} height={32} className="h-8 w-8" />
        {full && (
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white">DaanVeda</h1>
            <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded dark:bg-indigo-900/50 dark:text-indigo-400">
              Grant Manager
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className={cn("flex-1 space-y-1 py-4", full ? "px-3" : "px-2")}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              title={!full ? item.label : undefined}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-colors",
                full ? "gap-3 px-3 py-2.5" : "justify-center px-2 py-2.5",
                active
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200"
              )}
            >
              <Icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-indigo-600 dark:text-indigo-400" : "")} />
              {full && item.label}
            </Link>
          );
        })}
      </nav>

      {/* Credits Widget */}
      {full && (
        <div className="mx-3 mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/30">
          <div className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            <span>AI Credits</span>
            <span>124 remaining</span>
          </div>
          <Progress value={62} className="h-1.5" />
          <p className="mt-2 text-[10px] text-gray-500 dark:text-gray-500">Resets on 1st of each month</p>
        </div>
      )}

      {/* User */}
      <div className={cn("border-t border-gray-200 py-4 dark:border-gray-700", full ? "px-4" : "px-2")}>
        <div className={cn("flex items-center", full ? "gap-3" : "justify-center")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-400 flex-shrink-0">
            {initials}
          </div>
          {full && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{currentUser?.name || "Rajesh Sharma"}</p>
                <p className="text-xs text-gray-500 truncate dark:text-gray-400">{currentUser?.email || "rajesh@daanveda.org"}</p>
              </div>
              <Link href="/login" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <LogOut className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden rounded-lg bg-white p-2 shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-60 flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:hidden dark:border-gray-700 dark:bg-gray-800",
          mobileOpen ? "translate-x-0 flex" : "-translate-x-full"
        )}
      >
        {sidebarContent(true)}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 border-r border-gray-200 bg-white transition-all duration-200 dark:border-gray-700 dark:bg-gray-800",
          collapsed ? "lg:w-16" : "lg:w-60"
        )}
      >
        {sidebarContent(!collapsed)}
        {/* Collapse toggle */}
        <button
          onClick={toggle}
          className="absolute -right-3 top-7 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-3.5 w-3.5 text-gray-500" />
          ) : (
            <PanelLeftClose className="h-3.5 w-3.5 text-gray-500" />
          )}
        </button>
      </aside>
    </>
  );
}
