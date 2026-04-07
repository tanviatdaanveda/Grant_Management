"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Search,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/storage";
import { User } from "@/types";
import Image from "next/image";
import { useSidebar } from "./SidebarContext";

const navItems = [
  { href: "/ngo-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ngo-dashboard/applications", label: "My Applications", icon: FileText },
  { href: "/ngo-dashboard/grants", label: "Browse Grants", icon: Search },
  { href: "/ngo-dashboard/organization", label: "Organization", icon: Building2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function NgoSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { collapsed, toggle } = useSidebar();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const isActive = (href: string) => {
    if (href === "/ngo-dashboard") return pathname === "/ngo-dashboard";
    return pathname.startsWith(href);
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "PM";

  const sidebarContent = (full: boolean) => (
    <>
      {/* Logo */}
      <div className={cn("flex items-center gap-2 py-5", full ? "px-6" : "justify-center px-2")}>
        <Image src="/logo-icon.png" alt="DaanVeda" width={32} height={32} className="h-8 w-8" />
        {full && (
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white">DaanVeda</h1>
            <span className="text-[10px] font-medium text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded dark:bg-orange-900/50 dark:text-orange-400">
              NGO Portal
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
                  ? "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200"
              )}
            >
              <Icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-orange-600 dark:text-orange-400" : "")} />
              {full && item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className={cn("border-t border-gray-200 py-4 dark:border-gray-700", full ? "px-4" : "px-2")}>
        <div className={cn("flex items-center", full ? "gap-3" : "justify-center")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700 dark:bg-orange-900 dark:text-orange-400 flex-shrink-0">
            {initials}
          </div>
          {full && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  {user?.name || "Priya Menon"}
                </p>
                <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                  {user?.organization || "Hope Initiative India"}
                </p>
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
