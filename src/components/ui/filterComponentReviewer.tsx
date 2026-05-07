"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialogLeft";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface filterComponentReviewerProps {
  taskId: string;
  onFilterChange: (reviewerIds: string[]) => void;
}

interface Reviewer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface ReviewerResponse {
  message: string;
  code: number;
  data: {
    result: Reviewer[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const filterComponentReviewer: React.FC<
  filterComponentReviewerProps
> = ({ taskId, onFilterChange }) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReviewerIds, setSelectedReviewerIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: reviewerResponseData, isLoading: reviewersLoading } =
    useQuery<ReviewerResponse>({
      queryKey: ["taskReviewers", taskId],
      queryFn: async () => {
        if (!session?.access_token) {
          throw new Error("No authentication token available");
        }
        const response = await axios.get<ReviewerResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/project-mgmt/task/${taskId}/members?page=1&limit=100&role=Reviewer`,
          { headers: { Authorization: `Bearer ${session.access_token}` } },
        );
        return response.data;
      },
      enabled: !!session?.access_token && !!taskId && isOpen,
    });

  const reviewers = Array.isArray(reviewerResponseData?.data?.result) ? reviewerResponseData.data.result : [];

  const filteredReviewers = reviewers.filter((reviewer) =>
    `${reviewer.first_name} ${reviewer.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reviewer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleReviewerSelection = (reviewerId: string) => {
    setSelectedReviewerIds((prev) =>
      prev.includes(reviewerId)
        ? prev.filter((id) => id !== reviewerId)
        : [...prev, reviewerId]
    );
  };

  const applyFilters = () => {
    onFilterChange(selectedReviewerIds);
    setIsOpen(false);
  };

  const resetFilters = () => {
    setSelectedReviewerIds([]);
    onFilterChange([]);
    setIsOpen(false);
  };

  const getSelectedReviewerNames = () => {
    if (selectedReviewerIds.length === 0) return "Fliter by  Reviewer Name";
    if (selectedReviewerIds.length === 1) {
      const reviewer = reviewers.find((r) => r.id === selectedReviewerIds[0]);
      return reviewer ? `${reviewer.first_name} ${reviewer.last_name}` : "1 selected";
    }
    return `${selectedReviewerIds.length} selected`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="default" className="ml-2 bg-white">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 5.83325H5"
              stroke="black"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.5 14.1667H7.5"
              stroke="black"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 14.1667H17.5"
              stroke="black"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.5 5.83325H17.5"
              stroke="black"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 5.83325C5 5.05669 5 4.6684 5.12683 4.36211C5.296 3.95374 5.6205 3.62928 6.02883 3.46012C6.33517 3.33325 6.72342 3.33325 7.5 3.33325C8.27658 3.33325 8.66483 3.33325 8.97117 3.46012C9.3795 3.62928 9.704 3.95374 9.87317 4.36211C10 4.6684 10 5.05669 10 5.83325C10 6.60982 10 6.9981 9.87317 7.30439C9.704 7.71277 9.3795 8.03723 8.97117 8.20639C8.66483 8.33325 8.27658 8.33325 7.5 8.33325C6.72342 8.33325 6.33517 8.33325 6.02883 8.20639C5.6205 8.03723 5.296 7.71277 5.12683 7.30439C5 6.9981 5 6.60982 5 5.83325Z"
              stroke="black"
              strokeWidth="1.25"
            />
            <path
              d="M10 14.1667C10 13.3902 10 13.0019 10.1268 12.6956C10.296 12.2872 10.6205 11.9627 11.0288 11.7936C11.3352 11.6667 11.7234 11.6667 12.5 11.6667C13.2766 11.6667 13.6648 11.6667 13.9711 11.7936C14.3795 11.9627 14.704 12.2872 14.8731 12.6956C15 13.0019 15 13.3902 15 14.1667C15 14.9433 15 15.3316 14.8731 15.6379C14.704 16.0462 14.3795 16.3707 13.9711 16.5399C13.6648 16.6667 13.2766 16.6667 12.5 16.6667C11.7234 16.6667 11.3352 16.6667 11.0288 16.5399C10.6205 16.3707 10.296 16.0462 10.1268 15.6379C10 15.3316 10 14.9433 10 14.1667Z"
              stroke="black"
              strokeWidth="1.25"
            />
          </svg>
          {getSelectedReviewerNames()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Filter </h2>
          
        </div>
         <span className="text-sm px-6 pt-4 pb-2 font-semibold text-gray-400">Filter by Reviewer</span>

        {/* Search Bar */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter reviewer name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095FAF] focus:border-transparent text-sm"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Reviewers List */}
        <div className="px-6 py-4">
          {reviewersLoading ? (
            <div className="text-center py-8 text-gray-500">Loading reviewers...</div>
          ) : filteredReviewers.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              {searchQuery ? "No reviewers found matching your search" : "No reviewers found"}
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredReviewers.map((reviewer) => (
                <label
                  key={reviewer.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedReviewerIds.includes(reviewer.id)}
                    onChange={() => toggleReviewerSelection(reviewer.id)}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      {reviewer.first_name} {reviewer.last_name}
                    </div>
                    <div className="text-xs text-gray-500">{reviewer.email}</div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer with buttons */}
        <div className="flex items-center justify-between p-6 pt-4 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={resetFilters}
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border-gray-300 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
            Clear all filters
          </Button>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="px-6 py-2 text-sm text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={applyFilters}
              className="px-6 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
