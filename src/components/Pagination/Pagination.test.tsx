import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('renders pagination buttons', () => {
    render(
      <Router>
        <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
      </Router>
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Last')).toBeInTheDocument();
  });

  it('handles page change', () => {
    const handlePageChange = vitest.fn();
    render(
      <Router>
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      </Router>
    );
    fireEvent.click(screen.getByText('Next'));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('updates URL query parameter on page change', () => {
    const handlePageChange = (page) => {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('page', page.toString());
      window.history.pushState({}, '', `/?${searchParams.toString()}`);
    };

    render(
      <Router>
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      </Router>
    );
    fireEvent.click(screen.getByText('Next'));

    const searchParams = new URLSearchParams(window.location.search);
    expect(searchParams.get('page')).toBe('2');
  });
});
