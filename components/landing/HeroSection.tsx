"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl dark:bg-indigo-900/20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl dark:bg-orange-900/10" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 ring-1 ring-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:ring-indigo-800">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            </span>
            Trusted by 2,400+ NGOs across India
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
            Fund the Change.{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent">
              Streamline the Journey.
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            India&apos;s most intelligent grant management platform. Connect corporates with verified NGOs
            through AI-powered screening, automated evaluation, and transparent fund disbursement.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/grants">
              <Button size="lg" className="text-base px-8">
                Browse Grants <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/grants/new">
              <Button variant="outline" size="lg" className="text-base px-8">
                <Play className="mr-2 h-4 w-4" /> List a Grant
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-20 mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: "2,400+", label: "NGOs Registered" },
              { value: "₹180Cr+", label: "Disbursed" },
              { value: "340+", label: "Active Grants" },
              { value: "94%", label: "Match Rate" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white/80 backdrop-blur border border-gray-100 p-4 text-center shadow-sm dark:bg-gray-800/50 dark:border-gray-700"
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
