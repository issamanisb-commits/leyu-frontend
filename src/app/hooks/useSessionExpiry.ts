"use client";

import { useEffect, useCallback, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export const useSessionExpiry = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const logoutAttemptedRef = useRef(false);

  const handleLogout = useCallback(async () => {
    // Prevent multiple logout attempts
    if (logoutAttemptedRef.current) return;
    logoutAttemptedRef.current = true;

    console.log("Session expired - logging out user");
    
    // Only access localStorage on client side
    if (typeof window !== "undefined") {
      localStorage.removeItem("userData");
      localStorage.removeItem("userRole");
    }
    
    // Sign out with NextAuth - don't use redirect to avoid loops
    await signOut({ 
      redirect: false
    });

    // Manually redirect after a short delay to ensure signOut completes
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }, 500);
  }, []);

  const checkExpiry = useCallback(() => {
    if (status !== "authenticated" || !session) return;

    try {
      // Check if session object exists but user data is missing (indicates expired session)
      if (!session.user || !session.user.id || !session.access_token) {
        console.log("Session data missing - token likely expired");
        handleLogout();
        return;
      }

      // Check custom expires_at from user object
      if (session.user.expires_at && Date.now() >= session.user.expires_at) {
        console.log("User token expired based on expires_at");
        handleLogout();
        return;
      }
    } catch (error) {
      console.error("Error checking session expiry:", error);
    }
  }, [status, session, handleLogout]);

  // Check expiry on mount and every 5 minutes
  useEffect(() => {
    if (status !== "authenticated") return;

    // Initial check
    checkExpiry();

    // Set up interval to check every 5 minutes
    const interval = setInterval(checkExpiry, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [status, checkExpiry]);

  // Also check on window focus (when user returns to tab)
  useEffect(() => {
    // Only add event listeners on client side
    if (typeof window === "undefined") return;
    
    const handleFocus = () => {
      if (status === "authenticated") {
        checkExpiry();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [status, checkExpiry]);

  // Handle unauthenticated status
  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/login" && !pathname.startsWith("/linkForm")) {
      // Only redirect if we're not already on login page or public linkForm routes
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }, [status, pathname]);

  return {
    checkExpiry,
    handleLogout,
  };
};