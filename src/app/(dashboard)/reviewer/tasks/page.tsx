"use client";
import React from "react";
import AuthenticatedPage from "@/app/components/layout/AuthenticatedPage";
import TaskList from "@/app/components/reviewer/taskList";

export default function ReviewerTasks() {
  return (
    <AuthenticatedPage loadingMessage="Loading reviewer tasks...">
      <TaskList />
    </AuthenticatedPage>
  );
}
