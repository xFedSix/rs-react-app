import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Main, { MainProps } from './Main';
import resultsReducer from '../../Store/resultsSlice';
import { Item } from '../Result/Result';

vi.mock('../Loader/Loader', () => ({
  __esModule: true,
  default: () => <div>Loading...</div>
}));

vi.mock('../Result/Result', () => ({
  __esModule: true,
  default: ({
    items,
    error,
    onItemClick
  }: {
    items: Item[] | Item;
    error: string | null;
    onItemClick: (item: Item) => void;
  }) => (
    <div>
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          Results:{' '}
          {Array.isArray(items) ? (
            items.map((item: Item) => (
              <div key={item.id} onClick={() => onItemClick(item)}>
                {item.name}
              </div>
            ))
          ) : (
            <div>{items.name}</div>
          )}
        </div>
      )}
    </div>
  )
}));

const createMockStore = (initialState: any) => {
  return configureStore({
    reducer: {
      results: resultsReducer
    },
    preloadedState: {
      results: initialState
    }
  });
};

describe('Main', () => {
  const mockItems: Item[] = [
    {
      id: '1',
      name: 'Item 1',
      images: {
        small: '',
        large: ''
      },
      flavorText: undefined
    },
    {
      id: '2',
      name: 'Item 2',
      images: {
        small: '',
        large: ''
      },
      flavorText: undefined
    }
  ];

  const defaultProps: MainProps = {
    onItemClick: vi.fn(),
    onClick: vi.fn(),
    isLoading: false
  };

  const renderWithProvider = (props: MainProps, storeState = {}) => {
    const store = createMockStore({
      items: mockItems,
      error: null,
      isLoading: false,
      selectedItems: [],
      ...storeState
    });

    return render(
      <Provider store={store}>
        <Main {...props} />
      </Provider>
    );
  };

  it('renders loading state', () => {
    renderWithProvider(defaultProps, { isLoading: true });
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders results when not loading', () => {
    renderWithProvider(defaultProps);
    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders error message', () => {
    renderWithProvider(defaultProps, { error: 'Test error' });
    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
  });

  it('handles item click', () => {
    renderWithProvider(defaultProps);
    fireEvent.click(screen.getByText('Item 1'));
    expect(defaultProps.onItemClick).toHaveBeenCalledWith(mockItems[0]);
  });

  it('handles section click', () => {
    renderWithProvider(defaultProps);
    fireEvent.click(screen.getByText('Results'));
    expect(defaultProps.onClick).toHaveBeenCalled();
  });
});
