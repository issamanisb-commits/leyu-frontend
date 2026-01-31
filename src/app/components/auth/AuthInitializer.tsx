"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/app/context/auth-context";

export function AuthInitializer() {
  const { data: session, status } = useSession();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const expiresAt = session.expires ? new Date(session.expires).getTime() : null;
      setAuth(session.user as any, expiresAt);
    } else if (status === "unauthenticated") {
      setAuth(null, null);
    }
  }, [session, status, setAuth]);

  return null;
}