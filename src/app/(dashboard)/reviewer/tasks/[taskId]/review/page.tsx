"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AuthenticatedPage from "@/app/components/layout/AuthenticatedPage";
import MicroTaskList from "@/app/components/reviewer/microTaskList";
import { Button } from "@/components/ui/button";
import { formatDateMedium } from "@/app/types/dateUtils";

export default function ReviewerTaskReviewPage() {
  const params = useParams();
  const taskId = (params?.taskId as string) || "";

  // State for pagination and filtering
  const [microTaskPage, setMicroTaskPage] = useState(1);
  const [microTaskPageSize, setMicroTaskPageSize] = useState(7);
  const [verificationStatus, setVerificationStatus] = useState<
    string | undefined
  >(undefined);
  const [task, setTask] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeButton, setActiveButton] = useState<string>("all");
  const [isInnerDialogOpen, setIsInnerDialogOpen] = useState(false);

  // Load task data from localStorage
  useEffect(() => {
    const storedTaskData = localStorage.getItem(`task_${taskId}`);
    if (storedTaskData) {
      try {
        const taskData = JSON.parse(storedTaskData);
        setTask(taskData);
      } catch (error) {
        console.error("Error parsing stored task data:", error);
      }
    }
    setIsLoading(false);
  }, [taskId]);

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
    setMicroTaskPage(1); // Reset page when changing status
  };

  return (
    <AuthenticatedPage loadingMessage="Loading task review page...">
      {isLoading ? (
        <div className="p-6" />
      ) : task ? (
        <>
          {!isInnerDialogOpen && (
            <>
              <div className="flex flex-row py-3 px-2 mb-4">
                <span className="text-lg mb-2 mr-4 font-semibold">
                  {task?.name}
                </span>
                <div
                  className={`flex items-center space-x-1 px-2 py-2 rounded-2xl ${
                    task?.is_closed ? "bg-red-500" : "bg-[#ECFDF3]"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      task?.is_closed ? "bg-red-500" : "bg-[#037847]"
                    }`}
                  ></span>
                  <span
                    className={`text-xs text-gray-600 ${
                      task?.is_closed ? "text-red-500" : "text-[#037847]"
                    }`}
                  >
                    {task?.is_closed ? "Inactive" : "Active"}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 px-2 text-xs text-gray-600 mb-3">
                <div className="flex flex-col items-start">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                    {task?.taskType?.task_type}
                  </span>
                </div>

                <div className="flex flex-col items-start px-2 py-1">
                  <span>
                    Created:{" "}
                    {task?.created_date
                      ? formatDateMedium(task.created_date)
                      : ""}
                  </span>
                </div>
              </div>
              <div className="flex flex-row">
                <Button
                  className={`mr-4 mb-4 w-25 border-r-background px-4 py-2 rounded-full text-sm font-medium ${
                    activeButton === "all"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-800"
                  }`}
                  onClick={() => handleButtonClick("all")}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${activeButton === "all" ? "bg-white" : "bg-gray-400"}`}
                  ></span>
                  <span className="text-xs">All</span>
                </Button>

                <Button
                  className={`mr-4 mb-4 w-35 border-r-background px-4 py-2 rounded-full text-sm font-medium ${
                    activeButton === "Pending"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-800"
                  }`}
                  onClick={() => handleButtonClick("Pending")}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${activeButton === "Pending" ? "bg-[#FB7E37]" : "bg-[#FB7E37]"}`}
                  ></span>
                  <span className="text-xs">Pending</span>
                </Button>

                <Button
                  className={`mr-4 mb-4 w-35 border-r-background px-4 py-2 rounded-full text-sm font-medium ${
                    activeButton === "Rejected"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-800"
                  }`}
                  onClick={() => handleButtonClick("Rejected")}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${activeButton === "Rejected" ? "bg-[#f00]" : "bg-[#f00]"}`}
                  ></span>
                  <span className="text-xs">Rejected</span>
                </Button>

                <Button
                  className={`mr-4 mb-4 w-35 border-r-background px-4 py-2 rounded-full text-sm font-medium ${
                    activeButton === "Approved"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-800"
                  }`}
                  onClick={() => handleButtonClick("Approved")}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${activeButton === "Approved" ? "bg-[#02B516]" : "bg-[#02B516]"}`}
                  ></span>
                  <span className="text-xs">Approved</span>
                </Button>
                <Button
                  className={`mr-4 mb-4 w-35 border-r-background px-4 py-2 rounded-full text-sm font-medium ${
                    activeButton === "Flagged"
                      ? "bg-primary text-white"
                      : "bg-white text-red-800"
                  }`}
                  onClick={() => handleButtonClick("Flagged")}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${activeButton === "Flagged" ? "bg-[#f4fcf5]" : "bg-[#f77777]"}`}
                  ></span>
                  <span className="text-xs">Flagged</span>
                </Button>
              </div>
            </>
          )}
          <MicroTaskList
            taskType={task?.taskType?.task_type || ""}
            title={task?.name || ""}
            createdDate={task?.created_date || ""}
            taskId={taskId}
            taskStatus={task?.is_closed ?? true}
            microTaskPage={microTaskPage}
            setMicroTaskPage={setMicroTaskPage}
            microTaskPageSize={microTaskPageSize}
            setMicroTaskPageSize={setMicroTaskPageSize}
            searchQuery=""
            status_data={activeButton}
            verificationStatus={verificationStatus}
            setVerificationStatus={setVerificationStatus}
            onInnerDialogOpenChange={setIsInnerDialogOpen}
          />
        </>
      ) : (
        <div className="p-6">
          <p className="text-red-600">
            Task data not found. Please go back to the task list and try again.
          </p>
        </div>
      )}
    </AuthenticatedPage>
  );
}
