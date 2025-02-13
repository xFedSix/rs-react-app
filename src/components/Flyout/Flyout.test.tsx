import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Flyout from './Flyout';
import resultsReducer from '../../Store/resultsSlice';

const createMockStore = (selectedItems = []) => {
  return configureStore({
    reducer: {
      results: resultsReducer
    },
    preloadedState: {
      results: {
        selectedItems,
        items: [],
        error: null,
        isLoading: false
      }
    }
  });
};

describe('Flyout', () => {
  it('renders nothing when no items are selected', () => {
    const store = createMockStore([]);
    const { container } = render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders flyout when items are selected', () => {
    const selectedItems = [
      { id: 1, name: 'Pikachu', images: { small: '', large: '' } }
    ];
    const store = createMockStore(selectedItems);

    render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );

    expect(screen.getByText('1 items are selected')).toBeInTheDocument();
    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('unselects all items when clicking Unselect all', () => {
    const selectedItems = [
      { id: 1, name: 'Pikachu', images: { small: '', large: '' } }
    ];
    const store = createMockStore(selectedItems);

    render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );

    fireEvent.click(screen.getByText('Unselect all'));
    expect(store.getState().results.selectedItems).toHaveLength(0);
  });

  it('triggers download when clicking Download', () => {
    const createObjectURL = vi.fn();
    const revokeObjectURL = vi.fn();
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;

    const selectedItems = [
      { id: 1, name: 'Pikachu', images: { small: '', large: '' } }
    ];
    const store = createMockStore(selectedItems);

    render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );

    fireEvent.click(screen.getByText('Download'));
    expect(createObjectURL).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalled();
  });
});
