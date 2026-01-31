import { Button } from "@/components/ui/button";

interface PaginationHelperProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  buttonVariant?: {
    active: "outline" | "ghost" | "default";
    inactive: "outline" | "ghost" | "default";
  };
  buttonClassName?: {
    active: string;
    inactive: string;
  };
}

export const renderPaginationButtons = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  buttonVariant = { active: "outline", inactive: "ghost" },
  buttonClassName = { active: "bg-primary text-black font-bold border-primary", inactive: "" }
}: PaginationHelperProps) => {
  if (totalPages <= maxVisiblePages) {
    // Show all pages if total is less than or equal to max visible
    return Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
      <Button
        key={pageNumber}
        variant={currentPage === pageNumber ? buttonVariant.active : buttonVariant.inactive}
        className={
          currentPage === pageNumber ? buttonClassName.active : buttonClassName.inactive
        }
        size="sm"
        onClick={() => onPageChange(pageNumber)}
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
      variant={currentPage === 1 ? buttonVariant.active : buttonVariant.inactive}
      className={
        currentPage === 1 ? buttonClassName.active : buttonClassName.inactive
      }
      size="sm"
      onClick={() => onPageChange(1)}
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
          variant={currentPage === i ? buttonVariant.active : buttonVariant.inactive}
          className={
            currentPage === i ? buttonClassName.active : buttonClassName.inactive
          }
          size="sm"
          onClick={() => onPageChange(i)}
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
        variant={currentPage === totalPages ? buttonVariant.active : buttonVariant.inactive}
        className={
          currentPage === totalPages ? buttonClassName.active : buttonClassName.inactive
        }
        size="sm"
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </Button>
    );
  }
  
  return pages;
};