// src/app/components/ClientLoginWrapper.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import LoginPage from "@/app/(auth)/login/page";

export default function ClientLoginWrapper() {
  return (
    <SessionProvider>
      <LoginPage />
    </SessionProvider>
  );
}