"use client";

import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DashboardGrid } from "@/features/dashboard/components/DashboardGrid";

export default function Page() {
  return (
    <main className="mx-auto max-w-screen-2xl p-6">
      <DashboardHeader />
      <DashboardGrid />
    </main>
  );
}
