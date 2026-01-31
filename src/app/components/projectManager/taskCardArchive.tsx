import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { TaskCardType } from "@/app/types/project";
import { formatDateMedium } from "@/app/types/dateUtils";
import { Basedata, BasedataTaskType } from "@/app/types/basedate";
import { DeleteTask } from "./deleteTaskArchive";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialogLeft";
import { useBasedataall, useBasedataTaskType } from "@/lib/hooks/useBasedata";
import { useUpdateBasicTAsk, useDeleteTask } from "@/lib/hooks/useProject";

interface TaskCardArchiveProps {
  task: TaskCardType;
  onClick: (taskId: string) => void;
}

interface UpdateTaskForm {
  name: string;
  description: string;
  task_type_id: string;
  language_id: string;
  is_public: boolean;
  require_contributor_test: boolean;
}

const TaskCardArchive: React.FC<TaskCardArchiveProps> = ({ task, onClick }) => {
  const { data: languageData, isLoading: isLanguageLoading } = useBasedataall({
    servicename: "language",
  });
  const { data: TaskTypeData, isLoading: isTaskTypeLoading } =
    useBasedataTaskType({
      servicename: "task-type",
    });
  const languageOptions =
    languageData?.data?.map((lang: Basedata) => ({
      id: lang.id,
      name: lang.name,
      code: lang.code,
      description: lang.description,
    })) || [];
  const taskTypeOptions =
    TaskTypeData?.data?.map((taskType: BasedataTaskType) => ({
      id: taskType.id,
      name: taskType.task_type,
    })) || [];
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<UpdateTaskForm>({
    name: task.name,
    description: task.description,
    task_type_id: task.taskType.id || "",
    language_id: task.language_id,
    is_public: task.is_public,
    require_contributor_test: task.require_contributor_test,
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateTasktMutation = useUpdateBasicTAsk();
  const deleteTaskMutation = useDeleteTask(task.id);
  const [isOpenDeletor, setIsOpenDeletor] = useState(false);

  // Close dropdown when clicking/tapping outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTasktMutation.mutateAsync({
        id: task.id,
        name: formData.name,
        description: formData.description,
        task_type_id: formData.task_type_id,
        language_id: formData.language_id,
        is_public: formData.is_public,
        require_contributor_test: formData.require_contributor_test,
      });
      setIsEditDialogOpen(false);
      setIsDropdownOpen(false); // Close dropdown on successful update
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTaskMutation.mutateAsync();
      setIsDeleteDialogOpen(false);
      setIsDropdownOpen(false); // Close dropdown after deletion
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleEditClick = () => {
    setIsDropdownOpen(false);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="border border-gray-100 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          {task.name}
        </h3>
        <div className="flex items-center space-x-1">
          <div className="bg-[#ECFDF3] px-2 py-1 rounded-2xl">
            <span
              className={`text-xs text-gray-600 ${
                task.is_closed ? "text-red-500" : "text-green-500"
              }`}
            >
              <span
                className={`h-2 w-2 mr-2 rounded-full ${
                  task.is_closed ? "bg-red-500" : "bg-green-800"
                }`}
              ></span>
              {task.is_closed ? "Inactive" : "Active"}
            </span>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.name}</p>
      <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
        <div>
          <span className="font-medium px-1 py-0.5 bg-purple-100 text-purple-800 rounded">
            Type:{task.taskType?.task_type}
          </span>{" "}
        </div>
        <div>
          <span className="font-medium">Created:</span>{" "}
          {task.created_date ? formatDateMedium(task.created_date) : ""}
        </div>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsDropdownOpen(false);
              setIsOpenDeletor(true);
            }}
            className="flex text-gray-500 border-gray-500 hover:bg-blue-50"
          >
            <svg
              width="16"
              height="18"
              viewBox="0 0 16 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.8008 3.4873L13.4008 8.2873M1.80078 3.4873L2.28478 11.5169C2.40798 13.5729 2.47038 14.6009 2.98398 15.3409C3.23758 15.7062 3.56453 16.0146 3.94398 16.2465C4.40958 16.5313 4.97118 16.6433 5.80078 16.6873"
                stroke="#5D5D5D"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M7 11.4872L7.9088 12.66C8.07387 12.0438 8.41935 11.4911 8.90087 11.0726C9.38239 10.6542 9.97798 10.3892 10.6112 10.3118C11.2444 10.2343 11.8863 10.3478 12.4545 10.6378C13.0227 10.9278 13.4912 11.381 13.8 11.9392M15 15.4872L14.0912 14.316C13.9274 14.9274 13.5861 15.4765 13.1102 15.8939C12.6344 16.3113 12.0455 16.5781 11.4179 16.6608C10.7904 16.7434 10.1525 16.6381 9.58481 16.3581C9.01715 16.0782 8.54525 15.6362 8.2288 15.088"
                stroke="#5D5D5D"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0.599609 3.48652H14.9996M11.0444 3.48652L10.498 2.36012C10.1356 1.61132 9.95401 1.23772 9.64121 1.00412C9.57172 0.952376 9.49815 0.906358 9.42121 0.866523C9.07481 0.686523 8.65881 0.686523 7.82761 0.686523C6.97481 0.686523 6.54841 0.686523 6.19561 0.873723C6.11762 0.915492 6.04323 0.963657 5.97321 1.01772C5.65721 1.26012 5.48041 1.64812 5.12681 2.42332L4.64201 3.48652"
                stroke="#5D5D5D"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>{" "}
            Restore
          </Button>
        </div>

        {/* Edit Dialog */}

        <DeleteTask
          isOpen={isOpenDeletor}
          onClose={() => setIsOpenDeletor(false)}
          task_id={task.id ? task.id : ""}
          task_name={task.name} // Add this line
        />
        {/* Delete Confirmation Dialog */}
        {/* <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will delete the task "{task.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog> */}
      </div>
    </div>
  );
};

export default TaskCardArchive;
