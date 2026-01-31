import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface Task {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  dialect: string;
  type: string;
  dateCreated: string;
  dateUpdated: string;
  description?: string;
}

const fetchTask = async (taskId: string): Promise<Task> => {
  const response = await fetch(`/api/tasks/${taskId}`);
  if (!response.ok) throw new Error("Failed to fetch task");
  return response.json();
};

const TaskDetailPage: React.FC = () => {
  const router = useRouter();
  const { taskId } = router.query;

  const { data: task, isLoading, error } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchTask(taskId as string),
    enabled: !!taskId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Error loading task: {(error as Error).message}</p>
      </div>
    );
  }

  if (!task) {
    return <div className="p-6">Task not found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{task.name}</h1>
      <div className="border rounded-lg p-4 bg-white">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Task Details</h2>
          <p className="text-sm text-gray-600">{task.description || "No description available."}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Status:</span>{" "}
            <span className="flex items-center space-x-1">
              <span
                className={`h-2 w-2 rounded-full ${
                  task.status === "Active" ? "bg-green-500" : "bg-purple-500"
                }`}
              ></span>
              <span>{task.status}</span>
            </span>
          </div>
          <div>
            <span className="font-medium">Type:</span>{" "}
            <span className="px-1 py-0.5 bg-purple-100 text-purple-800 rounded">{task.type}</span>
          </div>
          <div>
            <span className="font-medium">Dialect:</span> {task.dialect}
          </div>
          <div>
            <span className="font-medium">Created On:</span> {task.dateCreated}
          </div>
          <div>
            <span className="font-medium">Last Updated:</span> {task.dateUpdated}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;