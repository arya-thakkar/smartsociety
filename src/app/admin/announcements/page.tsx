"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AnnouncementsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/complaints");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-pulse text-gray-500 font-medium">Redirecting to Communications...</div>
    </div>
  );
}
