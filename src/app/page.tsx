"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      // Still loading, wait
      return;
    }

    if (status === "authenticated" && session?.user?.role) {
      // User is authenticated, redirect to their dashboard
      const roleRoutes: Record<string, string> = {
        SuperAdmin: "/superadmin",
        ProjectManager: "/projectmanager",
        Facilitator: "/facilitator",
        Reviewer: "/reviewer",
        QualityAssurance: "/qualityAssurance",
      };
      
      const targetRoute = roleRoutes[session.user.role] || "/superadmin";
      console.log("Root page: Redirecting authenticated user to:", targetRoute);
      window.location.replace(targetRoute);
    } else {
      // User is not authenticated, redirect to login
      console.log("Root page: Redirecting unauthenticated user to login");
      window.location.replace("/login");
    }
  }, [status, session, router]);

  // Show loading while determining where to redirect
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center justify-center">
        <svg
          className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>Loading...</span>
      </div>
    </div>
  );
}
