"use client";
import React from "react";
import AuthenticatedPage from "@/app/components/layout/AuthenticatedPage";
import TaskList from "@/app/components/facilitator/taskList";

export default function FacilitatorTasks() {
  return (
    <AuthenticatedPage loadingMessage="Loading facilitator tasks...">
      <TaskList />
    </AuthenticatedPage>
  );
}
