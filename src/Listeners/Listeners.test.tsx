import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import Listeners from './Listeners';
import * as fetchDataModule from '../API/fetchData';

const mockFetchData = vi.spyOn(fetchDataModule, 'fetchData');

interface ListenersProps {
  triggerFetch: boolean;
  searchQuery: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  select?: string;
  onDataFetched: (data: any) => void;
  onError: (error: string) => void;
}

describe('Listeners', () => {
  const defaultProps: ListenersProps = {
    triggerFetch: false,
    searchQuery: 'test',
    onDataFetched: vi.fn(),
    onError: vi.fn()
  };

  it('fetches data when triggerFetch is true', async () => {
    const mockData = { data: 'test data', totalCount: 1 };
    mockFetchData.mockResolvedValueOnce(mockData);

    const { rerender } = render(
      <Listeners {...defaultProps} triggerFetch={false} />
    );
    rerender(<Listeners {...defaultProps} triggerFetch={true} />);

    await waitFor(() => {
      expect(defaultProps.onDataFetched).toHaveBeenCalledWith(mockData);
      expect(mockFetchData).toHaveBeenCalledWith('test', 1, 9, '', '');
    });
  });

  it('handles fetch error correctly', async () => {
    const mockError = new Error('Fetch error');
    mockFetchData.mockRejectedValueOnce(mockError);

    const { rerender } = render(
      <Listeners {...defaultProps} triggerFetch={false} />
    );
    rerender(<Listeners {...defaultProps} triggerFetch={true} />);

    await waitFor(() => {
      expect(defaultProps.onError).toHaveBeenCalledWith('Fetch error');
    });
  });

  it('handles unknown error correctly', async () => {
    const mockUnknownError = 'Unknown error';
    mockFetchData.mockRejectedValueOnce(mockUnknownError);

    const { rerender } = render(
      <Listeners {...defaultProps} triggerFetch={false} />
    );
    rerender(<Listeners {...defaultProps} triggerFetch={true} />);

    await waitFor(() => {
      expect(defaultProps.onError).toHaveBeenCalledWith(
        'Unknown error occurred'
      );
    });
  });
});
