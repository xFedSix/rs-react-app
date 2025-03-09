import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Result from './Result';
import resultsReducer, { updateSelectedItems } from '../../Store/resultsSlice';
import { Item } from '../../types/types';
import React from 'react';

const createMockStore = (initialState: any = {}) =>
  configureStore({
    reducer: {
      results: resultsReducer
    },
    preloadedState: {
      results: {
        items: [],
        selectedItems: [],
        isLoading: false,
        error: null,
        ...initialState
      }
    }
  });

const mockItems: Item[] = [
  {
    id: '1',
    name: 'Item 1',
    images: { small: 'small1.png', large: 'large1.png' },
    flavorText: 'Flavor 1'
  },
  {
    id: '2',
    name: 'Item 2',
    images: { small: 'small2.png', large: 'large2.png' },
    flavorText: 'Flavor 2'
  },
  {
    id: '3',
    name: 'Item 3',
    images: { small: 'small3.png', large: 'large3.png' },
    flavorText: ''
  }
];

describe('Result', () => {
  let store: ReturnType<typeof createMockStore>;
  const onItemClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    store = createMockStore({ items: mockItems, selectedItems: [] });
  });

  const renderWithProvider = (
    props: any,
    initialState: any = {
      items: mockItems,
      selectedItems: []
    }
  ) => {
    store = createMockStore(initialState);
    return render(
      <Provider store={store}>
        <Result {...props} />
      </Provider>
    );
  };

  it('renders "No results found" when items are empty', () => {
    renderWithProvider({ items: [], onItemClick }, { items: [] });
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('renders table rows for each item', () => {
    renderWithProvider({ items: mockItems, onItemClick });
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('displays item image, name, and flavor text correctly', () => {
    renderWithProvider({ items: mockItems, onItemClick });
    expect(screen.getByAltText('Item 1')).toHaveAttribute('src', 'small1.png');
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Flavor 1')).toBeInTheDocument();
    expect(screen.getByText('No information')).toBeInTheDocument();
  });

  it('dispatches updateSelectedItems on "Select All" check', () => {
    renderWithProvider({ items: mockItems, onItemClick });
    const selectAllCheckbox = screen.getByTestId('select-all-checkbox');
    fireEvent.click(selectAllCheckbox);
    expect(store.getState().results.selectedItems).toEqual(mockItems);
  });
  it('dispatches updateSelectedItems on "Select All" uncheck', async () => {
    store = createMockStore({ items: mockItems, selectedItems: mockItems });
    renderWithProvider(
      { items: mockItems, onItemClick },
      { items: mockItems, selectedItems: mockItems }
    );
    const selectAllCheckbox = screen.getByTestId('select-all-checkbox');
    fireEvent.click(selectAllCheckbox);
    expect(store.getState().results.selectedItems).toEqual([]);
  });

  it('select all is checked when all items are selected', async () => {
    store = createMockStore({ items: mockItems, selectedItems: mockItems });
    renderWithProvider(
      { items: mockItems, onItemClick },
      { items: mockItems, selectedItems: mockItems }
    );
    const selectAllCheckbox = screen.getByTestId('select-all-checkbox');
    expect(selectAllCheckbox).toBeChecked();
  });

  it('dispatches updateSelectedItems on individual item check', () => {
    renderWithProvider({ items: mockItems, onItemClick });
    const itemCheckbox = screen.getByTestId('pokemon-checkbox-1');
    fireEvent.click(itemCheckbox);
    expect(store.getState().results.selectedItems).toEqual([mockItems[0]]);
  });
  it('dispatches updateSelectedItems on individual item uncheck', async () => {
    store = createMockStore({
      items: mockItems,
      selectedItems: [mockItems[0]]
    });
    renderWithProvider(
      { items: mockItems, onItemClick },
      { items: mockItems, selectedItems: [mockItems[0]] }
    );
    const itemCheckbox = screen.getByTestId('pokemon-checkbox-1');
    fireEvent.click(itemCheckbox);
    expect(store.getState().results.selectedItems).toEqual([]);
  });

  it('calls onItemClick when item image is clicked', () => {
    renderWithProvider({ items: mockItems, onItemClick });
    const image = screen.getByAltText('Item 1');
    fireEvent.click(image);
    expect(onItemClick).toHaveBeenCalledWith(mockItems[0]);
  });
  it('calls onItemClick when item name is clicked', () => {
    renderWithProvider({ items: mockItems, onItemClick });
    const name = screen.getByText('Item 1');
    fireEvent.click(name);
    expect(onItemClick).toHaveBeenCalledWith(mockItems[0]);
  });
  it('renders with single item', () => {
    renderWithProvider({ items: mockItems[0], onItemClick });
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });
});
