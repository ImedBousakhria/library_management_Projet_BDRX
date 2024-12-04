import React from 'react';

const Pagination = ({
  totalItems,              // Total number of items (length of the data array)
  itemsPerPage,            // Number of items per page
  currentPage,             // Current page number
  onPageChange,            // Callback function for when the page changes
  siblingCount = 1,        // Number of page buttons to show on either side of the current page
}) => {
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Generate an array of page numbers to display
  const paginationRange = (start, end) => {
    let range = [];
    for (let i = start; i <= end; i++) {
      if (i > 0 && i <= totalPages) {
        range.push(i);
      }
    }
    return range;
  };

  // Get the page numbers to display, including previous and next page buttons
  const pages = () => {
    if (totalPages <= 7) {
      return paginationRange(1, totalPages); // Show all pages if less than 7 pages
    }

    const left = Math.max(1, currentPage - siblingCount); // Start range
    const right = Math.min(totalPages, currentPage + siblingCount); // End range

    const range = [];

    if (currentPage > siblingCount + 1) {
      range.push(1); // Add first page
      if (currentPage > siblingCount + 2) {
        range.push('...');
      }
    }

    range.push(...paginationRange(left, right));

    if (currentPage < totalPages - siblingCount) {
      if (currentPage < totalPages - siblingCount - 1) {
        range.push('...');
      }
      range.push(totalPages); // Add last page
    }

    return range;
  };

  // Handle page click
  const handleClick = (pageNumber) => {
    if (pageNumber === '...') return;
    onPageChange(pageNumber);
  };

  return (
    <div className="pagination-container flex justify-center items-center my-4">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-[#7E5A3C] text-white rounded-l-lg disabled:bg-[#E1C5B5] cursor-pointer"
        aria-label="Previous page"
      >
        &laquo;
      </button>

      <div className="pagination-pages flex items-center space-x-2 px-4">
        {pages().map((page, index) => (
          <button
            key={index}
            onClick={() => handleClick(page)}
            className={`px-4 py-2 rounded-lg transition-all ${page === currentPage ? 'bg-[#7E5A3C] text-white' : 'bg-[#E1C5B5] text-[#7E5A3C]'} hover:bg-[#7E5A3C] hover:text-white`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-[#7E5A3C] text-white rounded-r-lg disabled:bg-[#E1C5B5] cursor-pointer"
        aria-label="Next page"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;
