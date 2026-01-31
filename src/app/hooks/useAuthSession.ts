"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useAuthSession() {
  const { data: session, status, update } = useSession();
  const [isReady, setIsReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {

    
    if (status === "loading") {
      setIsReady(false);
      return;
    }

    if (status === "authenticated" && session) {
  
      setIsReady(true);
      setRetryCount(0);
      return;
    }

    if (status === "unauthenticated") {
      // Try to update session a few times before giving up
      if (retryCount < 3) {
     
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          update();
        }, 1000);
      } else {
       
        // Silently refresh the page to restore session
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }
  }, [status, session, update, retryCount]);

  return {
    session,
    status,
    isReady,
    isLoading: status === "loading" || (status === "unauthenticated" && retryCount < 3),
    isAuthenticated: status === "authenticated" && !!session,
    hasSessionError: status === "unauthenticated" && retryCount >= 3,
  };
}