/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import UserTableList from "./data-table";
import { individualColumns } from "./columns";
import { userProfiles } from "@/lib/hooks/useFetchUser";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function Users() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [verificationStatus, setVerificationStatus] = useState<string>();

  const { data: usersData, isLoading: isUserLoading } = userProfiles({
    page,
    pageSize,
    searchQuery: debouncedSearch,
    verificationStatus,
  });
  const paginatedUserData = usersData?.data.result || [];
  const userTotalElements = usersData?.data?.total || 0;
  const userTotalPages = usersData?.data.totalPages || 0;

  // Use API's pagination values instead of client-side filteri

  // Calculate showing ranges using API values
  const companyStartRecord = paginatedUserData.length
    ? (page - 1) * pageSize + 1
    : 0;
  const companyEndRecord = Math.min(page * pageSize, userTotalElements);

  // Reset page when switching tabs or changing pageSize
  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const statusOptions = [
    { id: "PENDING", label: "Pending" },
    { id: "ACCEPTED", label: "Accepted" },
    { id: "REJECTED", label: "Rejected" },
  ];

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
    <div>
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
  );
}
