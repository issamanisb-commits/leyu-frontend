"use client";
import React, { useState } from "react";
import AuthenticatedPage from "@/app/components/layout/AuthenticatedPage";
import TaskTable from "@/app/components/projectManager/taskTable";
import { MyProjectProfilesDetail } from "@/lib/hooks/useProjectManager";
import { useParams, useRouter } from "next/navigation";

const ProjectDetailPage: React.FC = () => {
  const params = useParams();
  const id = params.id as string;
  const [error, setError] = useState(null);

  return (
    <AuthenticatedPage loadingMessage="Loading project details...">
      <ProjectDetailContent id={id} error={error} setError={setError} />
    </AuthenticatedPage>
  );
};

const ProjectDetailContent: React.FC<{
  id: string;
  error: any;
  setError: (error: any) => void;
}> = ({ id, error, setError }) => {
  const router = useRouter();
  const { data: project, isLoading: isMicroTaskLoading } =
    MyProjectProfilesDetail({ id });


  if (isMicroTaskLoading) return <div>Loading project...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="p-6">
      
      
      <TaskTable
        projectId={project.data.id}
        projectTitle={project.data.name}
        manager={project.data.manager}
        projectStatus={
          project.data.status === "active" || project.data.status === "Active"
            ? "Active"
            : "Inactive"
        }
        createdOn={project.data.start_date}
        lastUpdated={project.data.end_date}
        description={project.data.description}
        cover_image_url={project.data.cover_image_url}
        tags={project.data.tags ? project.data.tags.map((tag) => tag) : null}
      />
    </div>
  );
};

export default ProjectDetailPage;
