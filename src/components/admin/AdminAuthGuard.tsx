"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminStorage } from "@/services/adminStore";

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const isLoggedIn = AdminStorage.isAdminLoggedIn();
    if (!isLoggedIn) {
      router.replace("/?auth=admin");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#faf6f2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-neutral-300 border-t-[#166534] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
            Verifying Admin Access...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
