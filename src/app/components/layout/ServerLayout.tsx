"use client";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import ClientLayout from "@/app/components/layout/ClientLayout";
import ClientLoginWrapper from "@/app/components/utils/ClientLoginWrapper";

export default function ServerLayout({
  children,
  isLoginPage = false,
  isPublicRoute = false,
}: {
  children: React.ReactNode;
  isLoginPage?: boolean;
  isPublicRoute?: boolean;
}) {
  const { data: session, status } = useSession();
  

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  // For login page, render without authentication
  if (isLoginPage) {
    return <>{children}</>;
  }
  if (isPublicRoute) {
    
    return <>{children}</>;
  }
  // For authenticated users, always show the full layout
  if (session) {
    return <ClientLayout>{children}</ClientLayout>;
  }

  // For unauthenticated users on public routes, show just the content

  // For unauthenticated users on protected routes, show login
  return <ClientLoginWrapper />;
}
