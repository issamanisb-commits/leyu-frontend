"use client";
import React from "react";
import AuthenticatedPage from "@/app/components/layout/AuthenticatedPage";
import TaskList from "@/app/components/reviewer/taskList";
import { useTranslation } from "@/lib/hooks/useTranslation";
export default function ReviewerTasks() {
  const { t } = useTranslation();
  return (
    <AuthenticatedPage loadingMessage={t('loadingReviewerTasks')}>
      <TaskList />
    </AuthenticatedPage>
  );
}
