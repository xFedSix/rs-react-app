import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Pagination from './Pagination';
import { vi } from 'vitest';

describe('Pagination', () => {
  const handlePageChange = vi.fn();
  const updateUrlAfterEachTest = () => {
    window.history.replaceState({}, '', '/');
  };
  afterEach(() => {
    updateUrlAfterEachTest();
  });
  it('renders pagination buttons', () => {
    render(
      <BrowserRouter>
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      </BrowserRouter>
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Last')).toBeInTheDocument();
  });

  it('handles page change', () => {
    render(
      <BrowserRouter>
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('Next'));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('updates URL query parameter on page change', () => {
    const updateURL = (page: { toString: () => string }) => {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('page', page.toString());
      window.history.pushState({}, '', `/?${searchParams.toString()}`);
    };

    render(
      <BrowserRouter>
        <Pagination currentPage={1} totalPages={5} onPageChange={updateURL} />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('Next'));

    const searchParams = new URLSearchParams(window.location.search);
    expect(searchParams.get('page')).toBe('2');
  });

  it('disables First and Previous buttons on the first page', () => {
    render(
      <BrowserRouter>
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      </BrowserRouter>
    );
    expect(screen.getByText('First')).toBeDisabled();
    expect(screen.getByText('Previous')).toBeDisabled();
    expect(screen.getByText('Next')).not.toBeDisabled();
    expect(screen.getByText('Last')).not.toBeDisabled();
  });

  it('disables Next and Last buttons on the last page', () => {
    render(
      <BrowserRouter>
        <Pagination
          currentPage={5}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      </BrowserRouter>
    );
    expect(screen.getByText('First')).not.toBeDisabled();
    expect(screen.getByText('Previous')).not.toBeDisabled();
    expect(screen.getByText('Next')).toBeDisabled();
    expect(screen.getByText('Last')).toBeDisabled();
  });

  it('handles invalid currentPage gracefully', () => {
    render(
      <BrowserRouter>
        <Pagination
          currentPage={10}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      </BrowserRouter>
    );
    expect(screen.getByText('Page 10 of 5')).toBeInTheDocument();
    expect(screen.getByText('First')).toBeDisabled();
    expect(screen.getByText('Previous')).toBeDisabled();
    expect(screen.getByText('Next')).toBeDisabled();
    expect(screen.getByText('Last')).toBeDisabled();
  });

  it('handles invalid totalPages gracefully', () => {
    render(
      <BrowserRouter>
        <Pagination
          currentPage={1}
          totalPages={-1}
          onPageChange={handlePageChange}
        />
      </BrowserRouter>
    );
    expect(screen.getByText('Page 1 of -1')).toBeInTheDocument();
    expect(screen.getByText('First')).toBeDisabled();
    expect(screen.getByText('Previous')).toBeDisabled();
    expect(screen.getByText('Next')).toBeDisabled();
    expect(screen.getByText('Last')).toBeDisabled();
  });

  it('handles clicking First button', () => {
    render(
      <BrowserRouter>
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('First'));
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it('handles clicking Previous button', () => {
    render(
      <BrowserRouter>
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('Previous'));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('handles clicking Next button', () => {
    render(
      <BrowserRouter>
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('Next'));
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it('handles clicking Last button', () => {
    render(
      <BrowserRouter>
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('Last'));
    expect(handlePageChange).toHaveBeenCalledWith(5);
  });
});
