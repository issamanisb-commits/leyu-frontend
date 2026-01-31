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

interface FilterOption {
  id: string;
  label: string;
  type: "text" | "time" | "boolean" | "select";
  options?: { value: string; label: string }[]; // For select type
}

interface FilterComponentProps {
  columns: { accessorKey: string; header: string }[];
  onFilterChangeAction: (
    filters: { [key: string]: string | boolean },
    endpoint: string
  ) => void;
  initialFilters?: { [key: string]: string | boolean };
  endpoint: string;
  includeLanguageDialect?: boolean;
}

export const FilterComponent: React.FC<FilterComponentProps> = ({
  columns,
  onFilterChangeAction,
  initialFilters = {},
  endpoint,
  includeLanguageDialect = false,
}) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<{ [key: string]: string | boolean }>(
    initialFilters
  );
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>(
    (initialFilters["language_id"] as string) || ""
  );
  const [selectedDialectId, setSelectedDialectId] = useState<string>(
    (initialFilters["dialect_id"] as string) || ""
  );
  const [createdStartDate, setCreatedStartDate] = useState<string>(
    (initialFilters["created_start_date"] as string) || ""
  );
  const [createdEndDate, setCreatedEndDate] = useState<string>(
    (initialFilters["created_end_date"] as string) || ""
  );

  interface Language { id: string; name: string }
  interface Dialect { id: string; name: string; description: string }
  interface LanguageResponse { message: string; code: number; data: Language[] }
  interface DialectResponse { message: string; code: number; data: Dialect[] }

  const { data: languageResponseData, isLoading: languageLoading } =
    useQuery<LanguageResponse>({
      queryKey: ["language"],
      queryFn: async () => {
        if (!session?.access_token) {
          throw new Error("No authentication token available");
        }
        const response = await axios.get<LanguageResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/setting/language/all`,
          { headers: { Authorization: `Bearer ${session.access_token}` } }
        );
        return response.data;
      },
      enabled: !!session?.access_token && includeLanguageDialect,
    });

  const { data: dialectResponseData, isLoading: dialectsLoading } =
    useQuery<DialectResponse>({
      queryKey: ["dialects", selectedLanguageId],
      queryFn: async () => {
        if (!session?.access_token) {
          throw new Error("No authentication token available");
        }
        const response = await axios.get<DialectResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/setting/dialect/language/${selectedLanguageId}`,
          { headers: { Authorization: `Bearer ${session.access_token}` } }
        );
        return response.data;
      },
      enabled: !!session?.access_token && !!selectedLanguageId && includeLanguageDialect,
    });

  // Determine filter options based on column types
  
  const filterOptions: FilterOption[] = columns.map((column) => {
    if (column.accessorKey === "gender") {
      return {
        id: column.accessorKey,
        label: column.header,
        type: "select",
        options: [
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
        ],
      };
    }
       if (column.accessorKey === "status") {
      return {
        id: column.accessorKey,
        label: column.header,
        type: "select",
        options: [
          { value: "Pending", label: "Pending" },
          { value: "Approved", label: "Approved" },
          { value: "Rejected", label: "Rejected" },
          { value: "Flagged", label: "Flagged" },
        ],
      };
    }
    
    return {
      id: column.accessorKey,
      label: column.header,
      type:
        column.accessorKey.includes("time") || column.accessorKey.includes("date")
          ? "time"
          : column.accessorKey.includes("is") || column.accessorKey.includes("has")
          ? "boolean"
          : "text",
    };
  });

  // Utility to convert filter value to string for input elements
  const getInputValue = (value: string | boolean | undefined): string => {
    if (typeof value === "boolean") {
      return value.toString();
    }
    return value || "";
  };

  const handleFilterChange = (columnId: string, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  // Toggle selection for gender buttons
  const toggleGenderSelection = (gender: string) => {
    if (selectedGenders.includes(gender)) {
      setSelectedGenders(selectedGenders.filter(item => item !== gender));
    } else {
      setSelectedGenders([...selectedGenders, gender]);
    }
  };


  const applyFilters = () => {
    const allFilters = {
      ...filters,
      gender: selectedGenders.join(","), // Convert array to comma-separated string
      ...(includeLanguageDialect && selectedLanguageId
        ? { language_id: selectedLanguageId }
        : {}),
      ...(includeLanguageDialect && selectedDialectId
        ? { dialect_id: selectedDialectId }
        : {}),
      ...(createdStartDate ? { created_start_date: createdStartDate } : {}),
      ...(createdEndDate ? { created_end_date: createdEndDate } : {}),
    };
    onFilterChangeAction(allFilters, endpoint);
    setIsOpen(false);
  };

  const resetFilters = () => {
    setFilters({});
    setSelectedGenders([]);
    setSelectedLanguageId("");
    setSelectedDialectId("");
    setCreatedStartDate("");
    setCreatedEndDate("");
    onFilterChangeAction({}, endpoint);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="default" className="ml-2 bg-white">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.75 7C3.75 6.80109 3.82902 6.61032 3.96967 6.46967C4.11032 6.32902 4.30109 6.25 4.5 6.25H19.5C19.6989 6.25 19.8897 6.32902 20.0303 6.46967C20.171 6.61032 20.25 6.80109 20.25 7C20.25 7.19891 20.171 7.38968 20.0303 7.53033C19.8897 7.67098 19.6989 7.75 19.5 7.75H4.5C4.30109 7.75 4.11032 7.67098 3.96967 7.53033C3.82902 7.38968 3.75 7.19891 3.75 7ZM6.25 12C6.25 11.8011 6.32902 11.6103 6.46967 11.4697C6.61032 11.329 6.80109 11.25 7 11.25H17C17.1989 11.25 17.3897 11.329 17.5303 11.4697C17.671 11.6103 17.75 11.8011 17.75 12C17.75 12.1989 17.671 12.3897 17.5303 12.5303C17.3897 12.671 17.1989 12.75 17 12.75H7C6.80109 12.75 6.61032 12.671 6.46967 12.5303C6.32902 12.3897 6.25 12.1989 6.25 12ZM9.25 17C9.25 16.8011 9.32902 16.6103 9.46967 16.4697C9.61032 16.329 9.80109 16.25 10 16.25H14C14.1989 16.25 14.3897 16.329 14.5303 16.4697C14.671 16.6103 14.75 16.8011 14.75 17C14.75 17.1989 14.671 17.3897 14.5303 17.5303C14.3897 17.671 14.1989 17.75 14 17.75H10C9.80109 17.75 9.61032 17.671 9.46967 17.5303C9.32902 17.3897 9.25 17.1989 9.25 17Z"
              fill="#667085"
            />
          </svg>
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
          <button
            // onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {/* <X className="h-5 w-5" /> */}
          </button>
        </div>

        <div className="px-6 pb-6 space-y-6">
          {includeLanguageDialect && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Language</label>
              <select
                value={selectedLanguageId || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedLanguageId(value);
                  setSelectedDialectId("");
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={languageLoading}
              >
                <option value="">All Languages</option>
                {(languageResponseData?.data || []).map((lang) => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
              <label className="text-sm font-medium text-gray-700">Dialect</label>
              <select
                value={selectedDialectId || ""}
                onChange={(e) => setSelectedDialectId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!selectedLanguageId || dialectsLoading}
              >
                <option value="">All Dialects</option>
                {(dialectResponseData?.data || []).map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          )}
          {filterOptions.map((option) => (
            <div key={option.id} className="space-y-3">
              <label className="text-sm font-medium text-gray-700">{option.label}</label>
              {option.id === "start_date" ? (
                // Special handling for start_date - split into two date fields
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Start Date</label>
                    <input
                      type="date"
                      value={createdStartDate}
                      onChange={(e) => setCreatedStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Select start date"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">End Date</label>
                    <input
                      type="date"
                      value={createdEndDate}
                      onChange={(e) => setCreatedEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Select end date"
                    />
                  </div>
                </div>
              ) : option.id === "gender" ? (
                // Special handling for gender with chip-style buttons
                <div className="flex flex-wrap gap-2">
                  {option.options?.map((genderOption) => (
                    <button
                      key={genderOption.value}
                      onClick={() => toggleGenderSelection(genderOption.value)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedGenders.includes(genderOption.value)
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {genderOption.label}
                    </button>
                  ))}
                </div>
              ) : option.type === "text" ? (
                <div className="relative">
                  <input
                    type="text"
                    value={getInputValue(filters[option.id])}
                    onChange={(e) => handleFilterChange(option.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter ${option.label}`}
                  />
                </div>
              ) : option.type === "time" ? (
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={getInputValue(filters[option.id])}
                    onChange={(e) => handleFilterChange(option.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Select ${option.label} time`}
                  />
                </div>
              ) : option.type === "boolean" ? (
                <div className="flex flex-wrap gap-2">
                  {["true", "false"].map((value) => (
                    <button
                      key={value}
                      onClick={() => handleFilterChange(option.id, value === "true")}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        getInputValue(filters[option.id]) === value
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {value === "true" ? "True" : "False"}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {option.options?.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleFilterChange(option.id, opt.value)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        getInputValue(filters[option.id]) === opt.value
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 pt-4 border-t border-gray-100">
          <Button
            onClick={resetFilters}
            variant="outline"
            className="flex items-center border-gray-200  gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="h-4 w-4" />
            Clear all filters
          </Button>
          <div className="flex gap-2">
            {/* <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
            >
              Cancel
            </Button> */}
            <Button
              onClick={applyFilters}
              className="px-4 py-2 text-sm bg-primary text-white hover:bg-blue-500"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};