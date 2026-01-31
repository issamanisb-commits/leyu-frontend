"use client";

import { useAuthSession } from "@/app/hooks/useAuthSession";

interface AuthenticatedPageProps {
  children: React.ReactNode;
  loadingMessage?: string;
}

export default function AuthenticatedPage({ 
  children, 
  loadingMessage = "Loading..." 
}: AuthenticatedPageProps) {
  const { isLoading, isAuthenticated, isReady } = useAuthSession();

  // Show loading state for any non-ready state
  if (isLoading || !isAuthenticated || !isReady) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}