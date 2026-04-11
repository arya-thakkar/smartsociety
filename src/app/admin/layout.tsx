"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="admin" userName="Admin Kumar">
      {children}
    </DashboardLayout>
  );
}
