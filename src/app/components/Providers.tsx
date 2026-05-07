// app/components/Providers.tsx
"use client";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSessionExpiry } from "@/app/hooks/useSessionExpiry";
import { LanguageProvider } from "@/app/context/language-context";

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
        <LanguageProvider>
          <ClientOnly>
            <SessionSyncHandler />
          </ClientOnly>
          {children}
        </LanguageProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

function SessionSyncHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Use session expiry hook to handle automatic logout
  useSessionExpiry();

  // Fetch and store user data when session is authenticated
  useEffect(() => {
    const fetchAndStoreUserData = async () => {
      if (status === "authenticated" && session?.access_token) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/iam/users/me`,
            {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.data && typeof window !== "undefined") {
              // Store complete user data including profile_picture
              localStorage.setItem("userData", JSON.stringify(data.data));
              console.log("User data stored in localStorage:", data.data);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchAndStoreUserData();
  }, [status, session?.access_token]);

  useEffect(() => {
    // Only run on client side and avoid running during initial hydration
    if (typeof window === "undefined") return;
    
    // Don't refresh on every session change - this causes the refresh loop
    // The session expiry hook will handle logout when needed
  }, []);

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