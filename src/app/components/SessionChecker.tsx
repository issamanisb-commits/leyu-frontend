"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function SessionChecker({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  

  useEffect(() => {
   
    
    // If unauthenticated after loading, redirect to login
    if (status === "unauthenticated") {
   
      window.location.href = "/login"; // Force redirect
    }
  }, [status]);

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  if (status === "unauthenticated") {
    
    return <div>Session lost. Redirecting to login...</div>;
  }

  return <>{children}</>;
}