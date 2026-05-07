"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { TaskCardType } from "@/app/types/project";
import { formatDateMedium } from "@/app/types/dateUtils";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface TaskCardProps {
  task: TaskCardType;
  onClick: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { t } = useTranslation();
  return (
    <div className="border border-gray-100 rounded-lg p-4 bg-white transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          {task.name}
        </h3>
        <div
          className={`flex items-center space-x-1 px-2 py-1 rounded-2xl ${
            task.is_closed ? "bg-red-50" : "bg-[#ECFDF3]"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              task.is_closed ? "bg-red-500" : "bg-[#037847]"
            }`}
          ></span>
          <span
            className={`text-xs font-medium ${
              task.is_closed ? "text-red-600" : "text-[#037847]"
            }`}
          >
           {task.is_closed ? t('inactive') : t('active')}
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.name}</p>
      <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-3">
        <div className="flex flex-col items-start">
          <span className="text-gray-500 px-2 py-1">{t('taskType')}:</span>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
            {task.taskType?.task_type}
          </span>
        </div>
        <div className="flex flex-col items-start px-2 py-2">
          <span className="text-gray-500">{t('dialect')}:</span>
          <span>{task.dialect}</span>
        </div>
        <div className="flex ml-3 flex-col items-stat px-2 py-1">
          <span className="text-gray-500">{t('createdDate')}:</span>
          <span>
            {task.created_date ? formatDateMedium(task.created_date) : ""}
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onClick(task.id)}
        className="w-full text-primary border-blue-600 hover:bg-blue-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
        >
          <path
            d="M1.66699 6.75346C1.66699 6.75346 5.39795 2.58679 10.0003 2.58679C14.6027 2.58679 18.3337 6.75346 18.3337 6.75346"
            stroke="#095FAF"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M17.9537 10.9577C18.207 11.3129 18.3337 11.4906 18.3337 11.7535C18.3337 12.0164 18.207 12.1941 17.9537 12.5493C16.8152 14.1457 13.908 17.5868 10.0003 17.5868C6.09264 17.5868 3.18541 14.1457 2.04703 12.5493C1.79367 12.1941 1.66699 12.0164 1.66699 11.7535C1.66699 11.4906 1.79367 11.3129 2.04703 10.9577C3.18541 9.36133 6.09264 5.92017 10.0003 5.92017C13.908 5.92017 16.8152 9.36133 17.9537 10.9577Z"
            stroke="#095FAF"
            strokeWidth="1.25"
          />
          <path
            d="M12.5 11.7534C12.5 10.3727 11.3807 9.25342 10 9.25342C8.61925 9.25342 7.5 10.3727 7.5 11.7534C7.5 13.1342 8.61925 14.2534 10 14.2534C11.3807 14.2534 12.5 13.1342 12.5 11.7534Z"
            stroke="#095FAF"
            strokeWidth="1.25"
          />
        </svg>{" "}
        {t('viewDetails')}
      </Button>
    </div>
  );
};

export default TaskCard;
