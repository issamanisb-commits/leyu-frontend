"use client";
import React from "react";
import AuthenticatedPage from "@/app/components/layout/AuthenticatedPage";
import TaskList from "@/app/components/qualityAssurance/taskList";

export default function ReviewerTasks() {
  return (
    <AuthenticatedPage loadingMessage="Loading quality assurance tasks...">
      <TaskList />
    </AuthenticatedPage>
  );
}
