"use client";
import React, { useState } from "react";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useGetTaskMicroTaskDetail } from "@/lib/hooks/useMicrotask";
import {
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Search,
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2,
  Copy,
  Plus,
  Users,
  Link2,
  ChevronDown,
} from "lucide-react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { MicroTask } from "@/app/types/project";

import type { SortingState } from "@tanstack/react-table";
interface MicroTaskListProps {
  taskId: string;
  microTaskPage: number;
  setMicroTaskPage: (page: number) => void;
  microTaskPageSize: number;
  setMicroTaskPageSize: (pageSize: number) => void;
  searchQuery: string;
  verificationStatus?: string;
  setVerificationStatus: (status: string | undefined) => void;
}
interface PaginationProps {
  pageCount: number;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  showingText: string;
}

const PaginationControls: React.FC<{ pagination: PaginationProps }> = ({
  pagination,
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <span className="md:text-sm text-xs text-gray-500">Showing</span>
        <select
          value={pagination.pageSize}
          onChange={(e) => {
            const newSize = Number(e.target.value);
            pagination.setPageSize(newSize);
            pagination.setPage(1);
          }}
          className="border  border-gray-100 rounded-md md:text-sm text-xs px-2 py-1 bg-white"
          title="Page Size"
        >
          {[5, 10, 20, 30, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className="md:text-sm text-xs pl-2 text-gray-500">
        {pagination.showingText}
      </div>
      <div className="flex gap-1">
        <Button
          size="sm"
          onClick={() => pagination.setPage(Math.max(1, pagination.page - 1))}
          disabled={pagination.page <= 1}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        {Array.from(
          { length: Math.max(1, pagination.pageCount) },
          (_, i) => i + 1
        ).map((pageNumber) => (
          <Button
            key={pageNumber}
            variant={pagination.page === pageNumber ? "outline" : "ghost"}
            className={
              pagination.page === pageNumber ? "border-brand text-brand" : ""
            }
            size="sm"
            onClick={() => pagination.setPage(pageNumber)}
          >
            {pageNumber}
          </Button>
        ))}
        <Button
          size="sm"
          onClick={() => pagination.setPage(pagination.page + 1)}
          disabled={pagination.page >= pagination.pageCount}
        >
          <ChevronRightIcon className="md:w-4 md:h-4 w-2 h-2" />
        </Button>
      </div>
    </div>
  );
};
const MicroTaskList: React.FC<MicroTaskListProps> = ({
  taskId,
  microTaskPage,
  setMicroTaskPage,
  microTaskPageSize,
  setMicroTaskPageSize,
  searchQuery,
  verificationStatus,
  setVerificationStatus,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const {
    data: microtasksData,
    isLoading: isMicroTaskLoading,
    error: microTaskError,
  } = useGetTaskMicroTaskDetail({
    microTaskPage,
    microTaskPageSize,
    searchQuery,
    taskId,
    verificationStatus,
  });

  const microtasks: MicroTask[] = Array.isArray(microtasksData?.data?.result)
    ? (microtasksData?.data?.result ?? [])
    : [];
  const microTaskTotalElements = microtasksData?.data?.total || 0;
  const microTaskTotalPages = microtasksData?.data?.totalPages || 1;
  const microTaskStartRecord = microtasks.length
    ? (microTaskPage - 1) * microTaskPageSize + 1
    : 0;
  const microTaskEndRecord = Math.min(
    microTaskPage * microTaskPageSize,
    microTaskTotalElements
  );

  const microTaskColumns: ColumnDef<MicroTask>[] = [
    {
      accessorKey: "taskName",
      header: "Task Name",
      enableSorting: true,
    },
    {
      accessorKey: "projectName",
      header: "Project Name",
      enableSorting: true,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      enableSorting: true,
      cell: ({ row }) => {
        const amount = row.getValue("amount");
        const isPositive = typeof amount === "number" && amount >= 0;
        return (
          <span className={isPositive ? "text-green-600" : "text-red-600"}>
            {isPositive ? `+${amount} Birr` : `${amount} Birr`}
          </span>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      enableSorting: true,
    },
    {
      accessorKey: "actions",
      header: "",
      cell: () => (
        <div className="flex space-x-2">
          <button aria-label="More options">
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      ),
    },
  ];

  const microTaskTable = useReactTable({
    data: microtasks,
    columns: microTaskColumns,
    state: {
      sorting,
      pagination: { pageIndex: microTaskPage - 1, pageSize: microTaskPageSize },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    rowCount: microTaskTotalElements,
  });

  if (microTaskError) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          Error loading microtasks: {(microTaskError as Error).message}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md  mt-4">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="relative w-64 h-20 rounded-lg overflow-hidden">
            <svg
              width="516"
              height="180"
              viewBox="0 0 516 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="515.83"
                height="180"
                rx="20"
                fill="url(#paint0_linear_422_6974)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_422_6974"
                  x1="-255.895"
                  y1="-4.34849e-06"
                  x2="960.443"
                  y2="207.197"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#095FAF" />
                  <stop stopColor="#086CA8" />
                  <stop offset="0.275781" stopColor="#086CA8" />
                  <stop
                    offset="0.484108"
                    stopColor="#0779A2"
                    stopOpacity="0.929746"
                  />
                  <stop
                    offset="0.657743"
                    stopColor="#068B99"
                    stopOpacity="0.824344"
                  />
                  <stop offset="1" stopColor="#02C27D" stopOpacity="0.51" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-start p-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-white">
                  Your Wallet Balance
                </span>
                <span className="text-xl font-bold text-white">
                  ETB 15,901.00
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 text-white border-white hover:bg-white hover:text-blue-800"
                >
                  Withdraw
                </Button>
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="bg-gray-50 p-2 rounded-md flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Data</span>
              <span className="text-green-600 flex items-center">
                120{" "}
                <span className="text-xs ml-1">↑1.3% Up from past week</span>
              </span>
            </div>
            <div className="bg-gray-50 p-2 rounded-md flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Data</span>
              <span className="text-green-600 flex items-center">
                120{" "}
                <span className="text-xs ml-1">↑1.3% Up from past week</span>
              </span>
            </div>
            <div className="bg-gray-50 p-2 rounded-md flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Data</span>
              <span className="text-green-600 flex items-center">
                120{" "}
                <span className="text-xs ml-1">↑1.3% Up from past week</span>
              </span>
            </div>
          </div>
        </div>
        <Button variant="link" className="text-primary text-sm font-medium">
          See All Transactions <ChevronDown className="inline w-4 h-4" />
        </Button>
      </div>
      <Table>
        <TableHeader>
          {microTaskTable.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-sm font-bold text-gray-700 p-4"
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className="flex items-center space-x-1 cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <span>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </span>
                      {header.column.getCanSort() && (
                        <span className="text-gray-500">
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDown className="h-4 w-4" />
                          ) : (
                            <ArrowUpDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {microTaskTable.getRowModel().rows?.length ? (
            microTaskTable.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-t border-gray-100 hover:bg-gray-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="py-3 px-4 text-sm text-gray-600"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={microTaskColumns.length}
                className="h-24 text-center"
              >
                {isMicroTaskLoading ? (
                  ""
                ) : (
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between p-4 border-t border-gray-100">
        <PaginationControls
          pagination={{
            pageCount: microTaskTotalPages,
            page: microTaskPage,
            setPage: setMicroTaskPage,
            pageSize: microTaskPageSize,
            setPageSize: setMicroTaskPageSize,
            showingText:
              microTaskTotalElements > 0
                ? `Showing ${microTaskStartRecord} to ${microTaskEndRecord} out of ${microTaskTotalElements} records`
                : "",
          }}
        />
      </div>
    </div>
  );
};

export default MicroTaskList;
