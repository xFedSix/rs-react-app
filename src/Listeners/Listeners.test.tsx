import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Listeners from './Listeners';
import * as fetchDataModule from '../API/fetchData';
import resultsReducer from '../Store/resultsSlice';

const mockFetchData = vi.spyOn(fetchDataModule, 'fetchData');

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      results: resultsReducer
    },
    preloadedState: {
      results: {
        items: [],
        error: null,
        selectedItems: [],
        isLoading: false,
        ...initialState
      }
    }
  });
};

const renderWithProvider = (component: React.ReactElement) => {
  const store = createMockStore();
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store
  };
};

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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches data when triggerFetch is true', async () => {
    const mockData = { data: 'test data', totalCount: 1 };
    mockFetchData.mockResolvedValueOnce(mockData);

    const { rerender } = renderWithProvider(
      <Listeners {...defaultProps} triggerFetch={false} />
    );

    rerender(
      <Provider store={createMockStore()}>
        <Listeners {...defaultProps} triggerFetch={true} />
      </Provider>
    );

    await waitFor(() => {
      expect(defaultProps.onDataFetched).toHaveBeenCalledWith(mockData);
      expect(mockFetchData).toHaveBeenCalledWith('test', 1, 9, '', '');
    });
  });

  it('handles fetch error correctly', async () => {
    const mockError = new Error('Fetch error');
    mockFetchData.mockRejectedValueOnce(mockError);

    const { rerender } = renderWithProvider(
      <Listeners {...defaultProps} triggerFetch={false} />
    );

    rerender(
      <Provider store={createMockStore()}>
        <Listeners {...defaultProps} triggerFetch={true} />
      </Provider>
    );

    await waitFor(() => {
      expect(defaultProps.onError).toHaveBeenCalledWith('Fetch error');
    });
  });

  it('handles unknown error correctly', async () => {
    const mockUnknownError = 'Unknown error';
    mockFetchData.mockRejectedValueOnce(mockUnknownError);

    const { rerender } = renderWithProvider(
      <Listeners {...defaultProps} triggerFetch={false} />
    );

    rerender(
      <Provider store={createMockStore()}>
        <Listeners {...defaultProps} triggerFetch={true} />
      </Provider>
    );

    await waitFor(() => {
      expect(defaultProps.onError).toHaveBeenCalledWith(
        'Unknown error occurred'
      );
    });
  });
});
