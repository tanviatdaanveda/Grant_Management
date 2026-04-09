"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Phone, Mail, Globe, Save, CheckCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function OrganizationPage() {
  const [saved, setSaved] = useState(false);
  const user = useAppStore((s) => s.currentUser);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <Header title="Organization Profile" />
      <main className="p-6 max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/40">
                <Building2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle>{user?.organization || "Hope Initiative India"}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="success">Verified</Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">NGO Registration: NGO-MH-2019-04582</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input id="orgName" defaultValue={user?.organization || "Hope Initiative India"} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="regNumber">Registration Number</Label>
                  <Input id="regNumber" defaultValue="NGO-MH-2019-04582" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input id="contactPerson" defaultValue={user?.name || "Priya Menon"} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="email" defaultValue={user?.email || "priya@hopeinitiative.org"} className="pl-9" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="phone" defaultValue="+91 98765 43210" className="pl-9" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <div className="relative mt-1">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="website" defaultValue="https://hopeinitiative.org" className="pl-9" />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="address"
                    defaultValue="42, Gandhi Nagar, Andheri East, Mumbai, Maharashtra 400069"
                    className="pl-9 min-h-[80px]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mission">Mission Statement</Label>
                <Textarea
                  id="mission"
                  defaultValue="Hope Initiative India is dedicated to empowering marginalized communities through education, healthcare, and sustainable livelihood programs across Maharashtra and Karnataka."
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label>Focus Areas</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Education", "Health", "Women Empowerment", "Livelihood"].map((area) => (
                    <Badge key={area} variant="outline" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                  {saved ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
