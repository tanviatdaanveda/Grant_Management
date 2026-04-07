import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reports</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Coming soon — Analytics and reporting features</p>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}