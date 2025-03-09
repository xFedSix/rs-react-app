import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MainContent from './MainContent';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import resultsReducer from '../../Store/resultsSlice';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Item } from '../../types/types';

vi.mock('./Main', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-main">Mock Main</div>
}));

vi.mock('../ItemDetails/ItemDetails', () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="mock-item-details">
      Mock Item Details
      <button data-testid="item-details-close" onClick={onClose}>
        Close
      </button>
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
describe('MainContent - Additional tests', () => {
  const dummyOnItemClick = vi.fn();
  const dummyOnCloseDetails = vi.fn();
  const dummyItem: Item = {
    id: '1',
    name: 'Test Item',
    images: { small: 'small.jpg', large: 'large.jpg' }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Main component', () => {
    const store = createMockStore({
      items: [],
      error: null,
      isLoading: false
    });
    render(
      <Provider store={store}>
        <MainContent
          isLoading={false}
          onItemClick={dummyOnItemClick}
          selectedItem={null}
          onCloseDetails={dummyOnCloseDetails}
        />
      </Provider>
    );

    expect(screen.getByTestId('mock-main')).toBeInTheDocument();
  });

  it('renders ItemDetails component when a selectedItem is provided', () => {
    const store = createMockStore({
      items: [],
      error: null,
      isLoading: false
    });
    render(
      <Provider store={store}>
        <MainContent
          isLoading={false}
          onItemClick={dummyOnItemClick}
          selectedItem={dummyItem}
          onCloseDetails={dummyOnCloseDetails}
        />
      </Provider>
    );
    expect(screen.getByTestId('mock-item-details')).toBeInTheDocument();
  });

  it('does not render ItemDetails component when selectedItem is null', () => {
    const store = createMockStore({
      items: [],
      error: null,
      isLoading: false
    });
    render(
      <Provider store={store}>
        <MainContent
          isLoading={false}
          onItemClick={dummyOnItemClick}
          selectedItem={null}
          onCloseDetails={dummyOnCloseDetails}
        />
      </Provider>
    );
    expect(screen.queryByTestId('mock-item-details')).toBeNull();
  });

  it('calls onCloseDetails when the close button in ItemDetails is clicked', () => {
    const store = createMockStore({
      items: [],
      error: null,
      isLoading: false
    });
    render(
      <Provider store={store}>
        <MainContent
          isLoading={false}
          onItemClick={dummyOnItemClick}
          selectedItem={dummyItem}
          onCloseDetails={dummyOnCloseDetails}
        />
      </Provider>
    );
    const closeButton = screen.getByTestId('item-details-close');
    fireEvent.click(closeButton);
    expect(dummyOnCloseDetails).toHaveBeenCalledTimes(1);
  });
});
