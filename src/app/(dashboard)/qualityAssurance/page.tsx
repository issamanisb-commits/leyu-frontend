"use client";
import React from "react";
import AuthenticatedPage from "@/app/components/layout/AuthenticatedPage";
import Landing from "@/app/components/payment/landing";
import TaskList from "@/app/components/qualityAssurance/taskList";

export default function ReviewerDashboard() {
  return (
    <AuthenticatedPage loadingMessage="Loading quality assurance  dashboard...">
      <TaskList />
    </AuthenticatedPage>
  );
}
