"use client";
import React, { useState } from "react";
import InstructionView from "@/app/components/qualityAssurance/instructionView";
import { TaskInstructions } from "@/app/types/project";
import { TaskResponseData } from "@/app/types/project";
import CreateTaskInstruction from "@/app/components/projectManager/createTaskInstruction";
import UpdateTAskForm from "@/app/components/projectManager/updateTaskForm";
import UpdateProjectModal from "../projectManager/updatePayment";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface TaskCardProps {
  task: TaskResponseData;
  type: boolean;
}
const TaskDetailsGeneral: React.FC<TaskCardProps> = ({ task, type }) => {
  console.log("TaskCardProps", task);
  const [isInstructionFullScreen, setIsInstructionFullScreen] = useState(false);
  const [editTaskScreen, setEditTaskScreen] = useState(false);
  const [showCreateInstructionForm, setShowCreateInstructionForm] =
    useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedInstruction, setSelectedInstruction] = useState<any>(null);
  const handleOpenInstruction = (instruction: TaskInstructions) => {
    setSelectedInstruction(instruction);
    setTimeout(() => {
      setIsInstructionFullScreen(true);
    }, 100);
  };
  const { t } = useTranslation();
  const EditSVGPayment: React.FC = () => {
    return (
      <>
        {type ? (
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation(); // Prevent triggering the card's onClick
              setIsUpdateModalOpen(true);
            }}
          >
            <svg
              width="30"
              height="25"
              viewBox="0 0 46 24"
              fill="none"
              className="ml-4"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="46" height="24" rx="8" fill="white" />
              <path
                d="M15.7281 5.23796C16.3491 4.56515 16.6596 4.22875 16.9895 4.03252C17.7856 3.55905 18.7659 3.54432 19.5754 3.99368C19.9108 4.17991 20.2308 4.50685 20.8709 5.16071C21.5109 5.81458 21.831 6.14151 22.0133 6.48419C22.4532 7.31101 22.4388 8.31241 21.9753 9.12566C21.7832 9.46271 21.4539 9.7799 20.7953 10.4142L12.9589 17.962C11.7108 19.1642 11.0867 19.7652 10.3067 20.0698C9.52679 20.3745 8.66935 20.3521 6.95449 20.3072L6.72117 20.3012C6.19911 20.2875 5.93808 20.2807 5.78635 20.1084C5.6346 19.9362 5.65532 19.6703 5.69675 19.1386L5.71925 18.8498C5.83586 17.353 5.89416 16.6047 6.18645 15.9319C6.47872 15.2592 6.98289 14.713 7.99121 13.6205L15.7281 5.23796Z"
                stroke="#095FAF"
                strokeWidth="1.25"
                strokeLinejoin="round"
              />
              <path
                d="M14.8333 5.33325L20.6666 11.1666"
                stroke="#095FAF"
                strokeWidth="1.25"
                strokeLinejoin="round"
              />
              <path
                d="M15.6667 20.3333H22.3334"
                stroke="#095FAF"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <></>
        )}
      </>
    );
  };
  const EditSVG: React.FC = () => {
    return (
      <>
        {type ? (
          <button onClick={() => setEditTaskScreen(true)}>
            <svg
              width="30"
              height="25"
              viewBox="0 0 46 24"
              fill="none"
              className="ml-4"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="46" height="24" rx="8" fill="white" />
              <path
                d="M15.7281 5.23796C16.3491 4.56515 16.6596 4.22875 16.9895 4.03252C17.7856 3.55905 18.7659 3.54432 19.5754 3.99368C19.9108 4.17991 20.2308 4.50685 20.8709 5.16071C21.5109 5.81458 21.831 6.14151 22.0133 6.48419C22.4532 7.31101 22.4388 8.31241 21.9753 9.12566C21.7832 9.46271 21.4539 9.7799 20.7953 10.4142L12.9589 17.962C11.7108 19.1642 11.0867 19.7652 10.3067 20.0698C9.52679 20.3745 8.66935 20.3521 6.95449 20.3072L6.72117 20.3012C6.19911 20.2875 5.93808 20.2807 5.78635 20.1084C5.6346 19.9362 5.65532 19.6703 5.69675 19.1386L5.71925 18.8498C5.83586 17.353 5.89416 16.6047 6.18645 15.9319C6.47872 15.2592 6.98289 14.713 7.99121 13.6205L15.7281 5.23796Z"
                stroke="#095FAF"
                strokeWidth="1.25"
                strokeLinejoin="round"
              />
              <path
                d="M14.8333 5.33325L20.6666 11.1666"
                stroke="#095FAF"
                strokeWidth="1.25"
                strokeLinejoin="round"
              />
              <path
                d="M15.6667 20.3333H22.3334"
                stroke="#095FAF"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <></>
        )}
      </>
    );
  };
  return (
    <>
      {isInstructionFullScreen ? (
        <>
          <InstructionView
            onCancel={() => setIsInstructionFullScreen(false)}
            taskInstructions={selectedInstruction}
            open={isInstructionFullScreen}
            setOpen={setIsInstructionFullScreen}
          />
        </>
      ) : (
        <>
          {editTaskScreen ? (
            <></>
          ) : (
            <div className="grid grid-cols-[2fr_1fr] gap-x-[2%]">
              {/* Left Column */}
              <div
                className="py-4 bg-white overflow-y-auto"
                style={{
                  scrollbarWidth: "none" /* Firefox */,
                  msOverflowStyle: "none" /* Internet Explorer 10+ */,
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none; /* Safari and Chrome */
                  }
                `}</style>
                {/* ── Basic Information ── */}
                <div className="mb-6 p-6 border border-gray-100  rounded-lg">
                  <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 22 22"
                      fill="none"
                      className="mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.541 6.54636L19.0886 5.76114C18.7464 5.1673 18.5753 4.87038 18.2842 4.75197C17.9931 4.63358 17.6638 4.727 17.0053 4.91386L15.8868 5.22891C15.4664 5.32586 15.0253 5.27086 14.6415 5.07364L14.3327 4.89547C14.0035 4.68464 13.7504 4.3738 13.6102 4.00843L13.3041 3.09416C13.1028 2.48915 13.0022 2.18664 12.7626 2.01361C12.523 1.84058 12.2048 1.84058 11.5682 1.84058H10.5463C9.90989 1.84058 9.59162 1.84058 9.35201 2.01361C9.11243 2.18664 9.01179 2.48915 8.81052 3.09416L8.50439 4.00843C8.36425 4.3738 8.11107 4.68464 7.78191 4.89547L7.4731 5.07364C7.08925 5.27086 6.6482 5.32586 6.2278 5.22891L5.10926 4.91386C4.45078 4.727 4.12155 4.63358 3.83044 4.75197C3.53932 4.87038 3.36823 5.1673 3.02604 5.76114L2.57359 6.54636C2.25284 7.103 2.09246 7.38133 2.12359 7.67762C2.15471 7.9739 2.36942 8.21266 2.79881 8.69019L3.74393 9.74682C3.97493 10.0392 4.13893 10.5489 4.13893 11.0071C4.13893 11.4656 3.97499 11.975 3.74396 12.2676L2.79881 13.3242C2.36942 13.8018 2.15472 14.0405 2.12359 14.3368C2.09246 14.6331 2.25284 14.9114 2.57359 15.468L3.02603 16.2532C3.36822 16.847 3.53932 17.144 3.83044 17.2624C4.12155 17.3808 4.45079 17.2874 5.10928 17.1005L6.22777 16.7854C6.64823 16.6885 7.08937 16.7435 7.47327 16.9408L7.78203 17.119C8.11112 17.3298 8.36424 17.6406 8.50436 18.006L8.81052 18.9204C9.01179 19.5254 9.11243 19.8279 9.35201 20.0009C9.59162 20.1739 9.90989 20.1739 10.5463 20.1739H11.5682C12.2048 20.1739 12.523 20.1739 12.7626 20.0009C13.0022 19.8279 13.1028 19.5254 13.3041 18.9204L13.6103 18.006C13.7504 17.6406 14.0034 17.3298 14.3326 17.119L14.6414 16.9408C15.0253 16.7435 15.4664 16.6885 15.8868 16.7854L17.0053 17.1005C17.6638 17.2874 17.9931 17.3808 18.2842 17.2624C18.5753 17.144 18.7464 16.847 19.0886 16.2532L19.541 15.468C19.8618 14.9114 20.0221 14.6331 19.991 14.3368C19.9599 14.0405 19.7452 13.8018 19.3158 13.3242L18.3706 12.2676C18.1396 11.975 17.9756 11.4656 17.9756 11.0071C17.9756 10.5489 18.1397 10.0392 18.3706 9.74682L19.3158 8.69019C19.7452 8.21266 19.9599 7.9739 19.991 7.67762C20.0221 7.38133 19.8618 7.103 19.541 6.54636Z"
                        stroke="black"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M14.2262 11.0001C14.2262 12.772 12.7898 14.2084 11.0179 14.2084C9.24596 14.2084 7.80957 12.772 7.80957 11.0001C7.80957 9.22816 9.24596 7.79175 11.0179 7.79175C12.7898 7.79175 14.2262 9.22816 14.2262 11.0001Z"
                        stroke="black"
                        strokeWidth="1.8"
                      />
                    </svg>
                    General Detaills
                  </h3>

                  <p className="text-sm break-words  text-gray-600 mb-4">
                    {task.description ? task.description : ""}
                  </p>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        Task Type
                      </span>
                      <span className="text-purple-600 bg-purple-100 rounded-full px-2.5 py-0.5 mt-1 inline-block w-fit">
                        {task.taskType?.task_type || "N/A"}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        Language
                      </span>
                      <span className="text-gray-600 mt-1">
                        {task.language?.name || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        Age Range
                      </span>
                      <span className="text-gray-600 mt-1">
                        {task.taskRequirement?.age?.min ?? "–"} –{" "}
                        {task.taskRequirement?.age?.max ?? "–"}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        Gender
                      </span>
                      <span className="text-gray-600 mt-1">
                        Female {task.taskRequirement?.gender?.female ?? "  "}%,
                        Male {task.taskRequirement?.gender?.male ?? "   "}%
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        Dialect Specific
                      </span>
                      <span
                        className={`mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium w-fit
                    ${
                      task.taskRequirement.is_dialect_specific
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                      >
                        {task.taskRequirement.is_dialect_specific
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>

                    <div className="flex flex-col ">
                      <span className="font-semibold text-gray-800">
                        Dialect(s)
                      </span>
                      <div className="flex ">
                        <span className=" text-gray-600 mt-1 bg-gray-200 px-2 py-1 rounded-2xl">
                          {task.taskRequirement?.dialects
                            ?.map((d) => d.name)
                            .join(", ") || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        Public Access
                      </span>
                      <span
                        className={`mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium w-fit
                    ${
                      task.is_public
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                      >
                        {task.is_public ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Demographics & Targeting ── */}
              </div>

              {/* Right Column */}
              <div
                className="mb-4 bg-white overflow-y-auto overflow-x-hidden"
                style={{
                  scrollbarWidth: "none" /* Firefox */,
                  msOverflowStyle: "none" /* Internet Explorer 10+ */,
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none; /* Safari and Chrome */
                  }
                `}</style>
                <div
                  className="mt-6 p-6 border border-gray-100 rounded-lg overflow-auto"
                  style={{
                    scrollbarWidth: "none" /* Firefox */,
                    msOverflowStyle: "none" /* Internet Explorer 10+ */,
                  }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {t("taskInstruction")}
                  </h3>

                  <div className="  mb-4">
                    {task.qaInstruction ? (
                      <div
                        key={task.qaInstruction?.id}
                        className="border mb-2 border-gray-300 rounded-lg px-2 py-2  space-x-2"
                      >
                        <span className="text-sm flex-wrap text-gray-700 break-words">
                          {task.qaInstruction?.title}
                        </span>
                        <div className="mt-auto flex justify-end pt-3">
                          <button
                            onClick={() =>
                              handleOpenInstruction(
                                task.qaInstruction as TaskInstructions,
                              )
                            }
                            className="border border-gray-300 hover:border-blue-500 text-primary px-4 py-2 rounded-lg flex items-center"
                          >
                            <span className="text-sm">View Instruction</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500"></p>
                    )}
                  </div>
                </div>
                {/* Task Configuration */}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
export default TaskDetailsGeneral;
