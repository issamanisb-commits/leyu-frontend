import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskResponse } from "@/app/types/project";
import { useGetProjectTaskAll } from "@/lib/hooks/useProject";
import {
  useAddUserSingleMicroTask,
  useExportUserTask,
} from "@/lib/hooks/useMicrotask";
import { toast } from "react-toastify";

interface ExportUserTaskProps {
  onClose: () => void;
  type?: string;
  taskData: TaskResponse;
}

const ExportUserTask: React.FC<ExportUserTaskProps> = ({
  onClose,
  type,
  taskData,
}) => {
  const [formData, setFormData] = useState({
    status: "",
    datasetStatus: "",
    contributors: "",
    acceptedTasks: "",
    taskName: "",
  });

  const { data: tasksDataAll, isLoading: isTaskLoading } = useGetProjectTaskAll(
    {
      projectId: taskData.data.project_id,
    }
  );

  const addProjectUserMutation = useAddUserSingleMicroTask();
  const exportUserTaskMutation = useExportUserTask();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "CSV") {
      try {
        let response = await exportUserTaskMutation.mutateAsync({
          sourceTaskId: taskData.data.id,
          status: "Active",
          limit: parseInt(formData.contributors),
          minNumberOfAcceptedDataSets: parseInt(formData.acceptedTasks),
        });
       

        // Ensure response.data exists and is an array
        const csvContent = [
          [
            "ID",
            "First Name",
            "Middle Name",
            "Last Name",
            "Email",
            "Phone Number",
            "Gender",
            "Contribution Count",
          ],
          ...(response.data && Array.isArray(response.data)
            ? response.data.map((user) => [
                user.id,
                user.first_name,
                user.middle_name,
                user.last_name,
                user.email,
                user.phone_number,
                user.gender,
                user.contribution_count,
              ])
            : []),
        ]
          .map((row) => row.map((cell) => `"${cell || ""}"`).join(","))
          .join("\n");

        if (!response.data || response.data.length === 0) {
          toast.warn("No data available to export");
          return;
        }

        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "exported_users.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Export error:", error);
        toast.error("Failed to export users");
      }
    } else {
      try {
        await addProjectUserMutation.mutateAsync({
          sourceTaskId: taskData.data.id,
          status: formData.status,
          datasetStatus: formData.datasetStatus,
          limit: parseInt(formData.contributors),
          minNumberOfAcceptedDataSets: parseInt(formData.acceptedTasks),
          assignedTo: formData.taskName,
        });
        toast.success("Users assigned successfully");
      } catch (error) {
        console.error("Assign user error:", error);
        toast.error("Failed to assign user");
      }
    }


    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[100] flex justify-end"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full sm:w-auto sm:min-w-[400px] sm:max-w-[800px] p-6 relative overflow-y-auto max-h-screen"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
        Export to {type}
          </h2>
          <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700"
          >
        <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form content */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto flex-1"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* User Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Select</option>
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dataset Status
          </label>
          <select
            name="datasetStatus"
            value={formData.datasetStatus}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Select</option>
            <option value="All">All</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Flagged">Flagged</option>
          </select>
        </div>

        {/* No of Contributors */}
          </div>
          <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          No of Contributors
        </label>
        <input
          type="number"
          name="contributors"
          value={formData.contributors}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
          </div>
          {/* Accepted Micro Tasks */}
          <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          No of micro task
        </label>
        <input
          type="number"
          name="acceptedTasks"
          value={formData.acceptedTasks}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
          </div>

          {type === "task" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Name
          </label>
          <select
            name="taskName"
            value={formData.taskName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Select task name</option>
            {isTaskLoading ? (
          <option disabled>Loading tasks...</option>
            ) : (
          tasksDataAll?.data.map((task) => (
            <option key={task.id} value={task.id}>
              {task.name}
            </option>
          ))
            )}
          </select>
        </div>
          )}
        </form>

        {/* Footer - sticky bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-end space-x-3">
          <Button
        type="button"
        onClick={onClose}
        variant="outline"
        className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
        Cancel
          </Button>
          <Button
        type="submit"
        onClick={handleSubmit}
        className="px-4 py-2 bg-[#095FAF] text-white hover:bg-blue-700"
          >
        {type === "CSV" ? "Export Contributors" : "Assign Tasks"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportUserTask;
