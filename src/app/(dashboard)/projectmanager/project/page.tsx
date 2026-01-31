"use client";
import AuthenticatedPage from "@/app/components/layout/AuthenticatedPage";
import Project from "@/app/components/projectManager/projects";

export default function ProjectManagerProjects() {
  return (
    <AuthenticatedPage loadingMessage="">
      <div>
        <div className="flex justify-between items-center mb-6"></div>
        <Project />
      </div>
    </AuthenticatedPage>
  );
}
