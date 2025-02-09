import React from 'react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  const isTotalPagesValid = totalPages > 0;
  const isInvalidPage = currentPage > totalPages || currentPage < 1;

  const handleFirst = () => {
    if (isTotalPagesValid && currentPage > 1) {
      onPageChange(1);
    }
  };

  const handlePrevious = () => {
    if (isTotalPagesValid && currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (isTotalPagesValid && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLast = () => {
    if (isTotalPagesValid && currentPage < totalPages) {
      onPageChange(totalPages);
    }
  };

  return (
    <div className="pagination">
      <button
        onClick={handleFirst}
        disabled={!isTotalPagesValid || currentPage === 1 || isInvalidPage}
      >
        First
      </button>
      <button
        onClick={handlePrevious}
        disabled={!isTotalPagesValid || currentPage === 1 || isInvalidPage}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={
          !isTotalPagesValid || currentPage === totalPages || isInvalidPage
        }
      >
        Next
      </button>
      <button
        onClick={handleLast}
        disabled={
          !isTotalPagesValid || currentPage === totalPages || isInvalidPage
        }
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
