/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, Loader2 } from "lucide-react";

import { UserData } from "@/app/types/global";

interface DataTableProps<TData> {
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

function PaginationControls({
  pagination,
}: {
  pagination: DataTableProps<any>["pagination"];
}) {
  if (!pagination) return null;

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left side - Page Size Selector */}
      <div className="flex items-center gap-2">
        <span className="md:text-sm text-xs text-gray-500">Showing</span>
        <select
          value={pagination.pageSize}
          onChange={(e) => {
            const newSize = Number(e.target.value);
            pagination.setPageSize(newSize);
            // Reset to first page when changing page size
            pagination.setPage(1);
          }}
          className="border rounded-md md:text-sm text-xs px-2 py-1 bg-white"
          title="Page Size"
        >
          {[5, 7, 10, 20, 30, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Center - Showing Text */}
      <div className="md:text-sm text-xs pl-2 text-gray-500">
        {pagination.showingText}
      </div>

      {/* Right side - Pagination Controls */}
      <div className="flex gap-1">
        <Button
          size="sm"
          onClick={() => pagination.setPage(Math.max(1, pagination.page - 1))}
          disabled={pagination.page <= 1}
        >
          <ChevronLeftIcon className="w-4 h-4 " />
        </Button>
        {(() => {
          const maxVisiblePages = 5;
          const currentPage = pagination.page;
          const totalPages = pagination.pageCount;
          
          if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than or equal to max visible
            return Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "outline" : "ghost"}
                className={
                  currentPage === pageNumber ? "border-brand text-brand" : ""
                }
                size="sm"
                onClick={() => pagination.setPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            ));
          }
          
          const pages = [];
          
          // Always show first page
          pages.push(
            <Button
              key={1}
              variant={currentPage === 1 ? "outline" : "ghost"}
              className={
                currentPage === 1 ? "border-brand text-brand" : ""
              }
              size="sm"
              onClick={() => pagination.setPage(1)}
            >
              1
            </Button>
          );
          
          // Add ellipsis if needed
          if (currentPage > 3) {
            pages.push(
              <span key="ellipsis-start" className="px-2 text-gray-500">
                ...
              </span>
            );
          }
          
          // Show pages around current page
          const startPage = Math.max(2, currentPage - 1);
          const endPage = Math.min(totalPages - 1, currentPage + 1);
          
          for (let i = startPage; i <= endPage; i++) {
            if (i !== 1 && i !== totalPages) {
              pages.push(
                <Button
                  key={i}
                  variant={currentPage === i ? "outline" : "ghost"}
                  className={
                    currentPage === i ? "border-brand text-brand" : ""
                  }
                  size="sm"
                  onClick={() => pagination.setPage(i)}
                >
                  {i}
                </Button>
              );
            }
          }
          
          // Add ellipsis if needed
          if (currentPage < totalPages - 2) {
            pages.push(
              <span key="ellipsis-end" className="px-2 text-gray-500">
                ...
              </span>
            );
          }
          
          // Always show last page if more than 1 page
          if (totalPages > 1) {
            pages.push(
              <Button
                key={totalPages}
                variant={currentPage === totalPages ? "outline" : "ghost"}
                className={
                  currentPage === totalPages ? "border-brand text-brand" : ""
                }
                size="sm"
                onClick={() => pagination.setPage(totalPages)}
              >
                {totalPages}
              </Button>
            );
          }
          
          return pages;
        })()}
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
}
export default function UserTableList({
  columns,
  data,
  isLoading,
  pagination,
}: DataTableProps<UserData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    manualPagination: !!pagination,
    pageCount: pagination?.pageCount,
    onPaginationChange: (updater) => {
      if (!pagination) return;
      const next =
        typeof updater === "function"
          ? updater({
              pageIndex: pagination.page - 1,
              pageSize: pagination.pageSize,
            })
          : updater;
      if (
        next.pageIndex !== undefined &&
        next.pageIndex + 1 !== pagination.page
      ) {
        pagination.setPage(next.pageIndex + 1);
      }
      if (
        next.pageSize !== undefined &&
        next.pageSize !== pagination.pageSize
      ) {
        pagination.setPageSize(next.pageSize);
        pagination.setPage(1); // Reset to first page when page size changes
      }
    },
    state: {
      sorting,
      pagination: {
        pageIndex: (pagination?.page ?? 1) - 1,
        pageSize: pagination?.pageSize ?? 7,
      },
    },
  });
  return (
    <div>
      <div>
        <div className=" px-2 py-2   bg-white overflow-hidden relative">
          {isLoading && table.getRowModel().rows?.length > 0 && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-sm font-bold h-12 text-gray-700 bg-[#FCFCFD] p-6"
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-gray-100">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-5 px-5 text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-96 text-center"
                  >
                    <div className="relative flex flex-col items-center justify-center py-12">
                      <img 
                        src="/empty.svg" 
                        alt="No users found" 
                        className="w-64 h-64 opacity-50"
                      />
                      
                      {/* Loading overlay for empty state */}
                      {isLoading && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center">
                          <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between py-4">
          <PaginationControls pagination={pagination} />
        </div>
      </div>
    </div>
  );
}
