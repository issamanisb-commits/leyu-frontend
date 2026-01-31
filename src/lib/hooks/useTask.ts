import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Task, MicroTask, TaskResponse } from "@/app/types/project";
import { PaginationResponse, SinglerResponse } from "@/app/types/global";
import { useSession } from "next-auth/react";

interface NewProjectTaskResponse extends PaginationResponse<Task> {}
interface NewTaskMicroTaskResponse extends PaginationResponse<MicroTask> {}
interface UseProjectDetailsProps {
  task_id: string;
}

interface ProjectDetailsMutationFnProps {
  projectData: Task;
}
export const useTaskUserDetails = (
  task_id: UseProjectDetailsProps["task_id"]
) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  return useMutation<Task, Error, ProjectDetailsMutationFnProps["projectData"]>(
    {
      mutationFn: async (projectData) => {
        if (!session?.access_token) {
          throw new Error("No authentication token available");
        }

        const response = await axios.put<Task>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/project-mgmt/project/${task_id}`,
          projectData,
          {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }
        );
        return response.data;
        toast.success("Success", {
          description: "Project updated successfully",
        });

        queryClient.invalidateQueries({ queryKey: ["projects"] });
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          toast.error("Error", {
            description:
              error.response?.data?.message || "Failed to update project",
          });
        }
      },
    }
  );
};
