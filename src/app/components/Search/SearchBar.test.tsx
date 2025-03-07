import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from './SearchBar';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string | number, value: { toString: () => any }) => {
      store[key as string] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string | number) => {
      delete store[key];
    }
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('SearchBar', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('renders the search input and button', () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(
      screen.getByPlaceholderText('Search for Pokémon...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('updates the input value on change', () => {
    render(<SearchBar onSearch={() => {}} />);
    const inputElement = screen.getByPlaceholderText('Search for Pokémon...');
    fireEvent.change(inputElement, { target: { value: 'Pikachu' } });
    expect(inputElement).toHaveValue('Pikachu');
  });

  it('calls onSearch with the trimmed query when the button is clicked', () => {
    const onSearchMock = vitest.fn();
    render(<SearchBar onSearch={onSearchMock} />);
    const inputElement = screen.getByPlaceholderText('Search for Pokémon...');
    const buttonElement = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(inputElement, { target: { value: '  Pikachu  ' } });
    fireEvent.click(buttonElement);

    expect(onSearchMock).toHaveBeenCalledWith('Pikachu');
    expect(onSearchMock).toHaveBeenCalledTimes(1);
  });

  it('calls onSearch with the trimmed query when Enter is pressed', () => {
    const onSearchMock = vitest.fn();
    render(<SearchBar onSearch={onSearchMock} />);
    const inputElement = screen.getByPlaceholderText('Search for Pokémon...');

    fireEvent.change(inputElement, { target: { value: '  Bulbasaur  ' } });
    fireEvent.keyDown(inputElement, { key: 'Enter' });

    expect(onSearchMock).toHaveBeenCalledWith('Bulbasaur');
    expect(onSearchMock).toHaveBeenCalledTimes(1);
  });
  it('calls onSearch once when Enter is pressed', () => {
    const onSearchMock = vitest.fn();
    render(<SearchBar onSearch={onSearchMock} />);
    const inputElement = screen.getByPlaceholderText('Search for Pokémon...');

    fireEvent.change(inputElement, { target: { value: 'Charizard' } });
    fireEvent.keyDown(inputElement, { key: 'Enter' });
    fireEvent.keyDown(inputElement, { key: 'Enter' });

    expect(onSearchMock).toHaveBeenCalledTimes(2);
  });

  it('should save the entered value to localStorage', () => {
    render(<SearchBar onSearch={() => {}} />);
    const inputElement = screen.getByPlaceholderText('Search for Pokémon...');
    fireEvent.change(inputElement, { target: { value: 'Pikachu' } });
    expect(localStorage.getItem('searchQuery')).toBe('Pikachu');
  });

  it('should load the value from localStorage on initial render', () => {
    localStorage.setItem('searchQuery', 'Charmander');
    render(<SearchBar onSearch={() => {}} />);
    const inputElement = screen.getByPlaceholderText('Search for Pokémon...');
    expect(inputElement).toHaveValue('Charmander');
  });
});
