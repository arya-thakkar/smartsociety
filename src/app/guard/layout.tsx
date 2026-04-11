"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function GuardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="guard" userName="Guard Smith">
      {children}
    </DashboardLayout>
  );
}
