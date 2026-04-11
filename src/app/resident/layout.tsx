"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function ResidentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="resident" userName="John Doe">
      {children}
    </DashboardLayout>
  );
}
