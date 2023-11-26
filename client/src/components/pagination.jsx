import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center gap-1 text-xs font-medium">
      <a
        href="#"
        onClick={() => onPageChange(currentPage - 1)}
        className={`inline-flex h-8 w-8 items-center justify-center rtl:rotate-180 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={currentPage === 1}
      >
        <span className="sr-only">Prev Page</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </a>

      <span className="h-4 w-px bg-white/25" aria-hidden="true"></span>

      <div>
        <label htmlFor="PaginationPage" className="sr-only">
          Page
        </label>

        <input
          type="number"
          className="h-8 w-12 rounded border-none bg-transparent p-0 text-center text-xs font-medium [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
        />
      </div>

      <span className="h-4 w-px bg-white/25"></span>

      <a
        onClick={() => onPageChange(currentPage + 1)}
        className={`inline-flex h-8 w-8 items-center justify-center rtl:rotate-180 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={currentPage === totalPages}
      >
        <span className="sr-only">Next Page</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </a>
    </div>
  );
};

export default Pagination;
