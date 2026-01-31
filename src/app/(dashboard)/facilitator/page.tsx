"use client";
import React from "react";
import AuthenticatedPage from "@/app/components/layout/AuthenticatedPage";
import Landing from "@/app/components/facilitator/landing";
import TaskList from "@/app/components/facilitator/taskList";
export default function FacilitatorDashboard() {
  return (
    <AuthenticatedPage loadingMessage="Loading facilitator tasks...">
      <TaskList />
    </AuthenticatedPage>
  );
}
