"use client";
import React from "react";
import AuthenticatedPage from "@/app/components/layout/AuthenticatedPage";
import Landing from "@/app/components/payment/landing";

export default function ReviewerDashboard() {
  return (
    <AuthenticatedPage loadingMessage="Loading reviewer dashboard...">
      <div>
        <Landing
         usertype="reviewer"
         
        />
      </div>
    </AuthenticatedPage>
  );
}
