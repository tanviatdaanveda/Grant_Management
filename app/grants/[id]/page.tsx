"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Grant } from "@/types";
import { getGrant } from "@/lib/actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Target,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

export default function GrantDetailPage() {
  const params = useParams();
  const [grant, setGrant] = useState<Grant | null>(null);
  const currentUser = useAppStore((s) => s.currentUser);
  const isManager = currentUser?.role === "grant_manager";

  useEffect(() => {
    const id = params.id as string;
    getGrant(id).then((g) => { if (g) setGrant(g); });
  }, [params.id]);

  if (!grant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Grant not found</p>
          <Link href="/grants">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Grants
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-icon.png" alt="DaanVeda" width={32} height={32} className="h-8 w-8" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">DaanVeda</span>
          </Link>
          <Link href="/grants">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" /> All Grants
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
        {/* Grant Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge
              variant={
                grant.status === "Active" ? "success" : grant.status === "Draft" ? "secondary" : "destructive"
              }
            >
              {grant.status}
            </Badge>
            <Badge variant="outline">{grant.grantType}</Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">{grant.title}</h1>
          <p className="text-gray-500 dark:text-gray-400">by {grant.funderName}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About this Grant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap dark:text-gray-300">{grant.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Eligibility Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap dark:text-gray-300">{grant.eligibilityCriteria}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expected Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap dark:text-gray-300">{grant.expectedOutcomes}</p>
              </CardContent>
            </Card>

            {grant.evaluationQuestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {grant.evaluationQuestions.map((q, i) => (
                      <div key={q.id} className="flex items-start gap-3 text-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-gray-700 dark:text-gray-300">{q.question}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {q.responseType} · Max Score: {q.maxScore} · Weightage: {q.weightage}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-5 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Fund</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(grant.totalAmount)}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Min / NGO</p>
                    <p className="font-medium dark:text-white">{formatCurrency(grant.minAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Max / NGO</p>
                    <p className="font-medium dark:text-white">{formatCurrency(grant.maxAmount)}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Deadline: {formatDate(grant.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {grant.geography === "National" ? "Pan India" : `${grant.state || grant.geography}${grant.city ? `, ${grant.city}` : ""}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{grant.applications} applications</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Target className="h-4 w-4" />
                    <span>{grant.identifierType} required</span>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-gray-500 mb-1.5 dark:text-gray-400">Focus Areas</p>
                  <div className="flex flex-wrap gap-1">
                    {grant.focusAreas.map((area) => (
                      <Badge key={area} variant="default">{area}</Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="h-3 w-3" /> {grant.phone || "—"}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail className="h-3 w-3" /> {grant.contactEmail || "—"}
                  </div>
                </div>

                {grant.status === "Active" && (
                  isManager ? (
                    <Link href={`/dashboard/grants/${grant.id}/applications`}>
                      <Button className="w-full mt-2" size="lg">
                        View Applications <Users className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/grants/${grant.id}/apply`}>
                      <Button className="w-full mt-2" size="lg">
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
