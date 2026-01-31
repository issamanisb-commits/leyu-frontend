import React, { useState } from "react";
import {
  Search,
  Loader2,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ChevronLeftIcon,
  ChevronRightIcon,
  Plus,
} from "lucide-react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialogLeft";

// Assuming these types are defined elsewhere
interface MicroTask {
  id: string;
  name: string;
  description: string;
  taskId: string;
  status: string;
  createdOn: string;
}

interface Task {
  id: string;
  name: string;
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
variant={pagination.page === pageNumber ? "outline" : "ghost"}            className={
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

// Props and state assumed to be passed from parent component
const MicroTasksTab = ({
  activeTab,
  microtasks,
  isMicroTaskLoading,
  microTaskPage,
  setMicroTaskPage,
  microTaskPageSize,
  setMicroTaskPageSize,
  microTaskTotalPages,
  microTaskTotalElements,
  taskSearchQuery,
  setTaskSearchQuery,
  tasks, // List of tasks to select from
}: {
  activeTab: string;
  microtasks: MicroTask[];
  isMicroTaskLoading: boolean;
  microTaskPage: number;
  setMicroTaskPage: (page: number) => void;
  microTaskPageSize: number;
  setMicroTaskPageSize: (size: number) => void;
  microTaskTotalPages: number;
  microTaskTotalElements: number;
  taskSearchQuery: string;
  setTaskSearchQuery: (query: string) => void;
  tasks: Task[];
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    taskId: "",
  });

  const microTaskColumns: ColumnDef<MicroTask>[] = [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
    },
    {
      accessorKey: "description",
      header: "Description",
      enableSorting: true,
    },
    {
      accessorKey: "taskId",
      header: "Associated Task",
      enableSorting: true,
      cell: ({ row }) => {
        const task = tasks.find((t) => t.id === row.original.taskId);
        return task ? task.name : "N/A";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="flex items-center space-x-1">
          <span
            className={`h-2 w-2 rounded-full ${
              row.original.status?.toLowerCase() === "active"
                ? "bg-green-500"
                : "bg-purple-500"
            }`}
          ></span>
          <span>{row.original.status}</span>
        </span>
      ),
    },
    {
      accessorKey: "createdOn",
      header: "Created On",
      enableSorting: true,
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

  const microTaskStartRecord = microtasks.length
    ? (microTaskPage - 1) * microTaskPageSize + 1
    : 0;
  const microTaskEndRecord = Math.min(
    microTaskPage * microTaskPageSize,
    microTaskTotalElements
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call an API to save the microtask
    setFormData({ name: "", description: "", taskId: "" });
    setIsDialogOpen(false);
  };

  if (activeTab !== "Micro Tasks") return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
            <option>All Tasks</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
       
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white hover:bg-blue-700 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Micro Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <p className="mb-8 font-bold ">Add Micro Task</p>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Name*</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Task*</label>
                    <select
                      value={formData.taskId}
                      onChange={(e) =>
                        setFormData({ ...formData, taskId: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                      required
                    >
                      <option value="">Select Task</option>
                      {tasks.map((task) => (
                        <option key={task.id} value={task.id}>
                          {task.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create  Micro Task</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {microtasks.length === 0 ? (
        <div className="relative flex flex-col items-center justify-center py-12">
          <img 
            src="/empty.svg" 
            alt="No micro tasks found" 
            className="w-64 h-64 opacity-50"
          />
          
          {/* Loading overlay for empty state */}
          {isMicroTaskLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
        </div>
      ) : isMicroTaskLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div>
          <div className="rounded-md border border-gray-100 bg-white overflow-hidden relative">
            <Table>
              <TableHeader>
                {microTaskTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-sm font-bold text-gray-500 bg-gray-50 px-2 py-5"
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
                    <TableRow key={row.id} className="border-gray-100">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-5 px-2 text-sm">
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
                      colSpan={microTaskColumns.length}
                      className="h-24 text-center"
                    >
                      {isMicroTaskLoading ? "" :  <div className="flex justify-center items-center h-48">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between py-4">
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
      )}
    </div>
  );
};

export default MicroTasksTab;
