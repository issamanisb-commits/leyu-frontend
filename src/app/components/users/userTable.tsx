"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import AuthenticatedPage from "@/app/components/layout/AuthenticatedPage";
import UserTableList from "./data-table";
import { individualColumns } from "./columns";
import { userProfilesFilter } from "@/lib/hooks/useFetchUser";
import { useDebounce } from "@/lib/hooks/useDebounce";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, Loader2, Plus } from "lucide-react";
import { FilterComponent } from "@/components/ui/filterComponent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialogLeft";
import AddUserForm from "@/app/components/users/addUserForm";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Language {
  id: string;
  name: string;
}

interface LanguageResponse {
  message: string;
  code: number;
  data: Language[];
}

interface Dialect {
  id: string;
  name: string;
  description: string;
}

interface DialectResponse {
  message: string;
  code: number;
  data: Dialect[];
}

interface Role {
  id: string;
  name: string;
  description: string;
}

interface RolesResponse {
  message: string;
  code: number;
  data: Role[];
}

export default function Users() {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [verificationStatus, setVerificationStatus] = useState<string>();
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  // Language/Dialect handled within FilterComponent now
  const [filters, setFilters] = useState<{ [key: string]: string | boolean }>(
    {}
  );

  const { data: usersData, isLoading: isUserLoading } = userProfilesFilter({
    page,
    pageSize,
    searchQuery: debouncedSearch,
    verificationStatus,
    token: session?.access_token || "",
    selectedRoleId: selectedRoleId || "",
    filters,
  });

  // Removed local language/dialect fetching; integrated into FilterComponent

  const { data: rolesResponse, isLoading: rolesLoading } =
    useQuery<RolesResponse>({
      queryKey: ["roles"],
      queryFn: async () => {
        const response = await axios.get<RolesResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/iam/auth/roles`,
          {
            headers: { Authorization: `Bearer ${session?.access_token}` },
          }
        );
        return response.data;
      },
      enabled: !!session?.access_token,
    });

  const userRoleOptions = [
    { id: "all", label: "All Roles" },
    ...(rolesResponse?.data.map((role: { id: string; name: string }) => ({
      id: role.id,
      label: role.name,
    })) || []),
  ];

  const filterableColumns = [
    { accessorKey: "first_name", header: "First Name" },
    { accessorKey: "middle_name", header: "Middle Name" },
    { accessorKey: "last_name", header: "Last Name (Grandfather Name)" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone_number", header: "Phone number" },
    { accessorKey: "gender", header: "Gender" },
    { accessorKey: "is_active", header: "Active" },
      { accessorKey: "start_date", header: "Created Date Range" },
  ];

  const paginatedUserData = usersData?.data.result || [];
  const userTotalElements = usersData?.data?.total || 0;
  const userTotalPages = usersData?.data.totalPages || 0;

  const handleFilterChange = (
    newFilters: { [key: string]: string | boolean },
    endpoint: string
  ) => {
    setFilters(newFilters);
    setPage(1);
  };

  // Language/Dialect selection moved to FilterComponent

  const companyStartRecord = paginatedUserData.length
    ? (page - 1) * pageSize + 1
    : 0;
  const companyEndRecord = Math.min(page * pageSize, userTotalElements);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleFilterApply = ({
    selectedStatus,
  }: {
    selectedAttributes: string[];
    selectedStatus?: string;
  }) => {
    setVerificationStatus(selectedStatus);
    setPage(1);
  };

  return (
    <AuthenticatedPage loadingMessage="Loading users...">
      <div>
        <div className=" flex  px-4 py-2  justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Select
              value={selectedRoleId}
              onValueChange={(value) => {
                setSelectedRoleId(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {rolesLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading roles...
                  </SelectItem>
                ) : (
                  userRoleOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {/* Language and Dialect filters moved inside FilterComponent */}
            <FilterComponent
              columns={filterableColumns}
              onFilterChangeAction={handleFilterChange}
              initialFilters={filters}
              endpoint=""
              includeLanguageDialect
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2" /> New User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <p className="mb-8 font-bold ">Add New User</p>
              </DialogHeader>
              <AddUserForm oncloseAction={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        <UserTableList
        
          columns={individualColumns}
          data={paginatedUserData}
          isLoading={isUserLoading}
          pagination={{
            pageCount: userTotalPages,
            page,
            setPage: handlePageChange,
            pageSize,
            setPageSize: handlePageSizeChange,
            showingText:
              userTotalElements > 0
                ? `Showing ${companyStartRecord} to ${companyEndRecord} out of ${userTotalElements} records`
                : "",
          }}
        />
      </div>
    </AuthenticatedPage>
  );
}