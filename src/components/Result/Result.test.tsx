import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Result, { Item } from './Result';
import resultsReducer from '../../Store/resultsSlice';

const mockItem: Item = {
  id: 1,
  name: 'Pikachu',
  images: {
    small: 'pikachu-small.png',
    large: 'pikachu-large.png'
  },
  flavorText: 'Electric type Pokémon'
};

const mockItems: Item[] = [
  {
    id: 1,
    name: 'Pikachu',
    images: {
      small: 'pikachu-small.png',
      large: 'pikachu-large.png'
    },
    flavorText: 'Electric type Pokémon'
  },
  {
    id: 2,
    name: 'Charmander',
    images: {
      small: 'charmander-small.png',
      large: 'charmander-large.png'
    },
    flavorText: 'Fire type Pokémon'
  }
];

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

describe('Result', () => {
  it('renders items from store', () => {
    const store = createMockStore({
      items: mockItems,
      error: null,
      selectedItems: [],
      isLoading: false
    });

    render(
      <Provider store={store}>
        <Result onItemClick={() => {}} />
      </Provider>
    );

    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Charmander')).toBeInTheDocument();
  });

  it('handles item click', () => {
    const handleItemClick = vi.fn();
    const store = createMockStore({
      items: mockItems,
      error: null,
      selectedItems: [],
      isLoading: false
    });

    render(
      <Provider store={store}>
        <Result onItemClick={handleItemClick} />
      </Provider>
    );
    const nameCell = screen.getByText('Pikachu').closest('td');
    if (nameCell) {
      fireEvent.click(nameCell);
    }

    expect(handleItemClick).toHaveBeenCalledWith(mockItems[0]);
  });

  it('displays error message from store', () => {
    const store = createMockStore({
      items: [],
      error: 'Error fetching data',
      selectedItems: [],
      isLoading: false
    });

    render(
      <Provider store={store}>
        <Result onItemClick={() => {}} />
      </Provider>
    );

    expect(screen.getByText('Error fetching data')).toBeInTheDocument();
  });

  it('displays "No results found" when items is empty array in store', () => {
    const store = createMockStore({
      items: [],
      error: null,
      selectedItems: [],
      isLoading: false
    });

    render(
      <Provider store={store}>
        <Result onItemClick={() => {}} />
      </Provider>
    );

    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('handles checkbox selection', () => {
    const store = createMockStore({
      items: mockItems,
      error: null,
      selectedItems: [],
      isLoading: false
    });

    render(
      <Provider store={store}>
        <Result onItemClick={() => {}} />
      </Provider>
    );

    const checkbox = screen.getByTestId('pokemon-checkbox-1');
    fireEvent.click(checkbox);

    const state = store.getState();
    expect(state.results.selectedItems).toEqual([mockItems[0]]);
  });

  it('handles "Select All" checkbox', () => {
    const store = createMockStore({
      items: mockItems,
      error: null,
      selectedItems: [],
      isLoading: false
    });

    render(
      <Provider store={store}>
        <Result onItemClick={() => {}} />
      </Provider>
    );

    const selectAllCheckbox = screen.getByTestId('select-all-checkbox');
    fireEvent.click(selectAllCheckbox);

    const state = store.getState();
    expect(state.results.selectedItems).toEqual(mockItems);
  });

  it('renders items with empty flavor text', () => {
    const mockItemsWithEmptyFlavorText = [
      {
        id: 1,
        name: 'Bulbasaur',
        images: {
          small: 'bulbasaur-small.png',
          large: 'bulbasaur-large.png'
        },
        flavorText: ''
      },
      {
        id: 2,
        name: 'Squirtle',
        images: {
          small: 'squirtle-small.png',
          large: 'squirtle-large.png'
        },
        flavorText: ''
      }
    ];
    const store = createMockStore({
      items: mockItemsWithEmptyFlavorText,
      error: null,
      selectedItems: [],
      isLoading: false
    });

    render(
      <Provider store={store}>
        <Result onItemClick={() => {}} />
      </Provider>
    );

    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Squirtle')).toBeInTheDocument();
    expect(screen.getAllByText('No information')).toHaveLength(2);
  });

  it('renders a single item', () => {
    const store = createMockStore({
      items: mockItem,
      error: null,
      selectedItems: [],
      isLoading: false
    });

    render(
      <Provider store={store}>
        <Result onItemClick={() => {}} />
      </Provider>
    );

    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Electric type Pokémon')).toBeInTheDocument();
  });
});
