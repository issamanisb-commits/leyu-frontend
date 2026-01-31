// app/components/Providers.tsx
"use client";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSessionExpiry } from "@/app/hooks/useSessionExpiry";

import ClientOnly from "./ClientOnly";

export default function Providers({ children, session }: { children: React.ReactNode, session?: any }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  }));
  
  return (
   <SessionProvider 
     session={session}
     refetchInterval={0}
     refetchOnWindowFocus={false}
     basePath="/api/auth"
   >
      <QueryClientProvider client={queryClient}>
        <ClientOnly>
          <SessionSyncHandler />
        </ClientOnly>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}

function SessionSyncHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Use session expiry hook to handle automatic logout
  useSessionExpiry();

  useEffect(() => {
    // Only run on client side and avoid running during initial hydration
    if (typeof window === "undefined") return;
    
    if (status === "authenticated") {
      // Use setTimeout to avoid hydration issues
      setTimeout(() => {
        router.refresh();
      }, 0);
    }
  }, [status, session, router]);

  // Handle NextAuth errors
  useEffect(() => {
    // Only add event listeners on client side
    if (typeof window === "undefined") return;
    
    const handleNextAuthError = (event: any) => {
      if (event.detail?.error?.message?.includes("CLIENT_FETCH_ERROR")) {
        // Optionally handle the error or just ignore it
      }
    };

    window.addEventListener('next-auth-error', handleNextAuthError);
    return () => window.removeEventListener('next-auth-error', handleNextAuthError);
  }, []);

  return null;
}