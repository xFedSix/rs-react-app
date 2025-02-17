import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaginationWrapper from './PaginationWrapper';

// Mock the Pagination component
vi.mock('../Pagination/Pagination', () => ({
  __esModule: true,
  default: ({ currentPage, totalPages, onPageChange }: any) => (
    <div data-testid="mock-pagination">
      <span>Current Page: {currentPage}</span>
      <span>Total Pages: {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next Page</button>
    </div>
  )
}));

describe('PaginationWrapper', () => {
  const defaultProps = {
    isLoading: false,
    currentPage: 1,
    totalPages: 10,
    onPageChange: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when loading', () => {
    const { container } = render(
      <PaginationWrapper {...defaultProps} isLoading={true} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders Pagination component when not loading', () => {
    render(<PaginationWrapper {...defaultProps} />);
    expect(screen.getByTestId('mock-pagination')).toBeInTheDocument();
  });

  it('passes correct props to Pagination component', () => {
    render(<PaginationWrapper {...defaultProps} />);
    expect(screen.getByText('Current Page: 1')).toBeInTheDocument();
    expect(screen.getByText('Total Pages: 10')).toBeInTheDocument();
  });

  it('handles page change correctly', () => {
    render(<PaginationWrapper {...defaultProps} />);
    screen.getByText('Next Page').click();
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('handles zero total pages', () => {
    render(<PaginationWrapper {...defaultProps} totalPages={0} />);
    expect(screen.getByText('Total Pages: 0')).toBeInTheDocument();
  });

  it('handles edge case currentPage greater than totalPages', () => {
    render(
      <PaginationWrapper {...defaultProps} currentPage={15} totalPages={10} />
    );
    expect(screen.getByText('Current Page: 15')).toBeInTheDocument();
  });

  it('handles negative page numbers', () => {
    render(
      <PaginationWrapper {...defaultProps} currentPage={-1} totalPages={-5} />
    );
    expect(screen.getByText('Current Page: -1')).toBeInTheDocument();
    expect(screen.getByText('Total Pages: -5')).toBeInTheDocument();
  });
});
