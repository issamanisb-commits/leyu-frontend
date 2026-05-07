"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { TaskCardType, TaskQA } from "@/app/types/project";
import { formatDateMedium } from "@/app/types/dateUtils";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface TaskCardProps {
  task: TaskQA;
  onClick: (taskId: string, task: TaskQA) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { t } = useTranslation();
  return (
    <div className="border border-gray-100 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          {task.name}
        </h3>
      </div>
      <div className="flex flex-row text-xs text-gray-400 mb-2">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 1V2M3 1V2"
            stroke="#959595"
            strokeWidth="0.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.99775 6.5H6.00225M5.99775 8.5H6.00225M7.9955 6.5H8M4 6.5H4.00449M4 8.5H4.00449"
            stroke="#959595"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.75 4H10.25"
            stroke="#959595"
            strokeWidth="0.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.25 6.1216C1.25 3.94297 1.25 2.85364 1.87606 2.17682C2.50212 1.5 3.50975 1.5 5.525 1.5H6.475C8.49025 1.5 9.4979 1.5 10.124 2.17682C10.75 2.85364 10.75 3.94297 10.75 6.1216V6.3784C10.75 8.55705 10.75 9.64635 10.124 10.3232C9.4979 11 8.49025 11 6.475 11H5.525C3.50975 11 2.50212 11 1.87606 10.3232C1.25 9.64635 1.25 8.55705 1.25 6.3784V6.1216Z"
            stroke="#959595"
            strokeWidth="0.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.5 4H10.5"
            stroke="#959595"
            strokeWidth="0.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg> <span className="ml-2 ">{task.created_date ? formatDateMedium(task.created_date) : ""}</span>
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-3">
        <div className="flex flex-col items-start">
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-2xl">
            {task.taskType.task_type ? task.taskType.task_type : ""}
          </span>
        </div>
        <div className="flex flex-col items-start px-2 py-2">
          <div className="flex flex-wrap gap-1">
            {task.taskRequirement.dialects?.map((dialect) => (
              <span
                key={dialect.id}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600  rounded-md"
              >
                {dialect}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.name}</p>
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
        {task.description}
      </p>

      <Button
        size="sm"
        onClick={() => onClick(task.id, task)}
        className="w-full"
      >
        {t('viewSubmissions')}
      </Button>
    </div>
  );
};

export default TaskCard;
