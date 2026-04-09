"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sidebar } from "@/components/layout/Sidebar";
import { NgoSidebar } from "@/components/layout/NgoSidebar";
import { SidebarProvider, useSidebar } from "@/components/layout/SidebarContext";
import { Header } from "@/components/layout/Header";
import { useAppStore } from "@/lib/store";
import { Check } from "lucide-react";

function SettingsContent() {
  const currentUser = useAppStore((s) => s.currentUser);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const { collapsed } = useSidebar();
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [org, setOrg] = useState(currentUser?.organization || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [city, setCity] = useState(currentUser?.city || "");
  const [state, setState] = useState(currentUser?.state || "");

  const isNgo = currentUser?.role === "ngo_user";

  const handleSave = () => {
    updateProfile({ name, email, organization: org, phone, city, state });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isNgo ? <NgoSidebar /> : <Sidebar />}
      <div className={`transition-all duration-200 ${collapsed ? 'lg:pl-16' : 'lg:pl-60'}`}>
        <Header title="Settings" />
        <main className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="settingsEmail">Email</Label>
                  <Input id="settingsEmail" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="org">Organization</Label>
                  <Input id="org" value={org} onChange={(e) => setOrg(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue={isNgo ? "NGO User" : "Grant Manager"} disabled className="mt-1 bg-gray-50 dark:bg-gray-700" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" placeholder="+91 ..." />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={state} onChange={(e) => setState(e.target.value)} className="mt-1" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={handleSave}>Save Changes</Button>
                {saved && (
                  <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <Check className="h-4 w-4" /> Saved successfully
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "New application received", description: "Get notified when an NGO applies to your grant" },
                { label: "Status updates", description: "Notified when application status changes" },
                { label: "Weekly digest", description: "Receive a weekly summary of activity" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border border-red-200 p-4 dark:border-red-800">
                <div>
                  <p className="font-medium text-red-600">Reset all data</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Clear all localStorage data and reload mock data
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  Reset Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <SidebarProvider>
      <SettingsContent />
    </SidebarProvider>
  );
}