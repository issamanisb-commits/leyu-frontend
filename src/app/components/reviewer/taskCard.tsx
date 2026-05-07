import React from "react";
import { Button } from "@/components/ui/button";
import { TaskCardType } from "@/app/types/project";
import { formatDateMedium } from "@/app/types/dateUtils";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface TaskCardProps {
  task: TaskCardType;
  onClick: (taskId: string, task: TaskCardType) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  console.log('task',task)
  const { t } = useTranslation();
  return (
    <div className="border border-gray-100 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          {task.name}
        </h3>
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-3">
        <div className="flex flex-col items-start">
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
            {task.task_type ? task.task_type : ""}
          </span>
        </div>
        <div className="flex flex-col items-start px-2 py-2">
          <div className="flex flex-wrap gap-1">
            {task.dialects?.map((dialect) => (
              <span
                key={dialect.id}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600  rounded-md"
              >
                {dialect.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-x text-primary mb-3 font-semibold line-clamp-2">
        {task.reviewer_credit_per_microtask && (
          <>
            ETB {task.reviewer_credit_per_microtask}/
            <span className="text-xs"> {t('microtaskUnit')}</span>
          </>
        )}
      </p>
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.name}</p>
      <div className="w-full flex  mb-3 items-center gap-4">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${
                Number(task?.total_reviews_count)
                  ? ((Number(task?.total_reviews_count) -
                      Number(task?.pending_reviews_count || 0)) /
                      Number(task?.total_reviews_count)) *
                    100
                  : 0
              }%`,
              backgroundColor: "#02C27D",
            }}
          />
        </div>

        {/* Text */}
        <div className="text-xs font-medium text-[#02C27D] whitespace-nowrap">
          {Number(task?.total_reviews_count || 0) -
            Number(task?.pending_reviews_count || 0) || 0}
          /{task?.total_reviews_count || 0}{" "}
          <span className="text-[#02C27D] text-[8px]">{t('complete')}</span>
        </div>
      </div>
      <Button
        size="sm"
        onClick={() => onClick(task.id, task)}
        className="w-full"
      >
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
        >
          <path
            d="M1.66699 6.75346C1.66699 6.75346 5.39795 2.58679 10.0003 2.58679C14.6027 2.58679 18.3337 6.75346 18.3337 6.75346"
            stroke="white"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M17.9537 10.9577C18.207 11.3129 18.3337 11.4906 18.3337 11.7535C18.3337 12.0164 18.207 12.1941 17.9537 12.5493C16.8152 14.1457 13.908 17.5868 10.0003 17.5868C6.09264 17.5868 3.18541 14.1457 2.04703 12.5493C1.79367 12.1941 1.66699 12.0164 1.66699 11.7535C1.66699 11.4906 1.79367 11.3129 2.04703 10.9577C3.18541 9.36133 6.09264 5.92017 10.0003 5.92017C13.908 5.92017 16.8152 9.36133 17.9537 10.9577Z"
            stroke="white"
            strokeWidth="1.25"
          />
          <path
            d="M12.5 11.7534C12.5 10.3727 11.3807 9.25342 10 9.25342C8.61925 9.25342 7.5 10.3727 7.5 11.7534C7.5 13.1342 8.61925 14.2534 10 14.2534C11.3807 14.2534 12.5 13.1342 12.5 11.7534Z"
            stroke="white"
            strokeWidth="1.25"
          />
        </svg>{" "} */}
        {t('viewSubmissions')}
      </Button>
    </div>
  );
};

export default TaskCard;