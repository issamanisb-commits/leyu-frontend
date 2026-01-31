"use client";

import { useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useAuthStore } from "@/app/context/auth-context";

export const useSessionExpiry = () => {
  const { data: session, status } = useSession();
  const checkSessionExpiry = useAuthStore((state) => state.checkSessionExpiry);

  const handleLogout = useCallback(async () => {
    // Only access localStorage on client side
    if (typeof window !== "undefined") {
      localStorage.removeItem("userData");
      localStorage.removeItem("userRole");
    }
    
    // Sign out with NextAuth
    await signOut({ 
      callbackUrl: "/login",
      redirect: true 
    });
  }, []);

  const checkExpiry = useCallback(() => {
    if (status !== "authenticated" || !session) return;

    try {
      // Check if session has expired
      if (checkSessionExpiry()) {
        handleLogout();
        return;
      }

      // Also check NextAuth session expiry if available
      if (session.expires) {
        const expiryTime = new Date(session.expires).getTime();
        if (Date.now() >= expiryTime) {
          handleLogout();
          return;
        }
      }

  
      if (!session.user?.id || !session.access_token) {
       
        handleLogout();
        return;
      }
    } catch (error) {
      console.error("Error checking session expiry:", error);
      // Don't logout on error, just log it
    }
  }, [status, session, checkSessionExpiry, handleLogout]);

  // Check expiry on mount and every minute
  useEffect(() => {
    if (status !== "authenticated") return;

    // Initial check
    checkExpiry();

    // Set up interval to check every minute
    const interval = setInterval(checkExpiry, 60000);

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

  return {
    checkExpiry,
    handleLogout,
  };
};