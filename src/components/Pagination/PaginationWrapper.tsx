import React from 'react';
import Pagination from '../Pagination/Pagination';

interface PaginationWrapperProps {
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationWrapper: React.FC<PaginationWrapperProps> = ({
  isLoading,
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (isLoading) return null;

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

export default PaginationWrapper;
