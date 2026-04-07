"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="lg:pl-60">
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
                  <Input id="name" defaultValue="Rajesh Sharma" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="settingsEmail">Email</Label>
                  <Input id="settingsEmail" defaultValue="rajesh@daanveda.org" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="org">Organization</Label>
                  <Input id="org" defaultValue="DaanVeda Foundation" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue="Grant Manager" disabled className="mt-1 bg-gray-50 dark:bg-gray-700" />
                </div>
              </div>
              <Button>Save Changes</Button>
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