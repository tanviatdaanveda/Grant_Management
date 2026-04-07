"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { initializeStorage, setCurrentUser } from "@/lib/storage";
import Image from "next/image";
import { mockUsers } from "@/lib/mockData";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"funder" | "ngo" | null>(null);

  const handleQuickLogin = (role: "funder" | "ngo") => {
    setSelectedRole(role);
    const user = role === "funder" ? mockUsers[0] : mockUsers[1];
    setEmail(user.email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    initializeStorage();
    const user = mockUsers.find((u) => u.email === email);
    if (user) {
      setCurrentUser(user);
      if (user.role === "ngo_user") {
        router.push("/ngo-dashboard");
      } else {
        router.push("/dashboard");
      }
    } else {
      // Default: treat as funder
      setCurrentUser(mockUsers[0]);
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <Image src="/logo-icon.png" alt="DaanVeda" width={40} height={40} className="h-10 w-10" />
          </Link>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to DaanVeda Grant Management</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Quick Login Buttons */}
          <div className="mb-6 space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center mb-3">
              Quick Login As
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin("funder")}
                className={`rounded-lg border-2 p-3 text-left transition-all ${
                  selectedRole === "funder"
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                }`}
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Funder</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Rajesh Sharma</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">rajesh@daanveda.org</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("ngo")}
                className={`rounded-lg border-2 p-3 text-left transition-all ${
                  selectedRole === "ngo"
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/30"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                }`}
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-white">NGO</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Priya Menon</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">priya@hopeinitiative.org</p>
              </button>
            </div>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                or enter email
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setSelectedRole(null); }}
                placeholder="rajesh@daanveda.org"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter any password"
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}