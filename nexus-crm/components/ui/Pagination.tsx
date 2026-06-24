'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="px-6 py-4 border-t border-[#E5E7EB] bg-white flex items-center justify-between">
      <span className="text-xs text-[#6B7280]">
        Showing {startItem} to {endItem} of {totalItems} entries
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-1 rounded hover:bg-[#F5F6F8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#6B7280] text-xl">chevron_left</span>
        </button>

        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="text-xs text-[#6B7280] px-1">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded text-xs font-medium transition-colors cursor-pointer ${
                currentPage === page
                  ? 'bg-[#4c5b71] text-white font-semibold shadow-sm'
                  : 'text-[#6B7280] hover:bg-[#F5F6F8] hover:text-[#111827]'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-1 rounded hover:bg-[#F5F6F8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#6B7280] text-xl">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
