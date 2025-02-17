import React from 'react';
import { describe, it, vi, expect, beforeEach, afterEach, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ApiFetchData from './ApiFetchData';
import { fetchData } from './fetchData';

vi.mock('./fetchData', () => ({
  fetchData: vi.fn()
}));

const mockReducer = (state = {}, _action: any) => state;

const createMockStore = () =>
  configureStore({
    reducer: {
      results: mockReducer
    }
  });

describe('ApiFetchData', () => {
  let mockStore: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    mockStore = createMockStore();
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRedux = (component: React.ReactElement) => {
    return render(<Provider store={mockStore}>{component}</Provider>);
  };

  it('renders Loader while fetching data', async () => {
    (fetchData as Mock).mockReturnValue(new Promise(() => {}));

    const { container } = renderWithRedux(<ApiFetchData />);

    const loader = container.querySelector('.loader');
    expect(loader).toBeInTheDocument();

    const ellipsisDivs = container.querySelectorAll('.lds-ellipsis > div');
    expect(ellipsisDivs.length).toBe(4);
  });

  it('removes Loader after fetching data', async () => {
    (fetchData as Mock).mockResolvedValue({ data: [], totalCount: 0 });

    const { container } = renderWithRedux(<ApiFetchData />);

    await waitFor(() => {
      const loader = container.querySelector('.loader');
      expect(loader).not.toBeInTheDocument();
    });
  });

  it('handles fetchData errors gracefully', async () => {
    (fetchData as Mock).mockRejectedValue(new Error('Test error'));

    renderWithRedux(<ApiFetchData />);

    await waitFor(() => {
      expect(screen.getByText('Error loading data')).toBeInTheDocument();
    });

    const loader = screen.queryByTestId('loader');
    expect(loader).not.toBeInTheDocument();
  });
});
