"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import ProjectCard from "../project/projectCard";
import { ChevronLeftIcon, ChevronRightIcon, Loader2 } from "lucide-react";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { ProjectDetail, Project, ProjectResponse } from "@/app/types/project";

interface DataTableProps<TData> {
  paginatedParojectData: ProjectResponse[];
  columns: ColumnDef<TData, any>[];
  data: TData[];
  isLoading?: boolean;
  pagination?: {
    pageCount: number;
    page: number;
    setPage: (page: number) => void;
    pageSize: number;
    setPageSize: (pageSize: number) => void;
    showingText: string;
  };
}

export function DataTable<TData>({
  paginatedParojectData,
  columns,
  data,
  isLoading = false,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 7,
      },
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border border-gray-100 bg-white overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-2">
            {paginatedParojectData.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                cover_image_url={project.cover_image_url}
                start_date={project.start_date}
                end_date={project.end_date}
                manager_id={project.manager_id}
                created_by={project.created_by}
                isLoading={isLoading}
                updated_by={project.updated_by}
                created_date={project.created_date}
                updated_date={project.updated_date}
                title={project.name}
                manager={project.manager}
                status={
                  project.status.toLowerCase() === "active"
                    ? "Active"
                    : project.status === "inactive"
                      ? "Inactive"
                      : "Inactive"
                }
                description={project.description}
                // onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
