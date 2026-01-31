// app/superadmin/layout.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import Providers from "@/app/components/Providers";

export default function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
