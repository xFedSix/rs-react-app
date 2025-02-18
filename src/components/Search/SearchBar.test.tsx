import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from './SearchBar';

vi.mock('../Search/SearchInputField', () => ({
  __esModule: true,
  default: ({ placeholder, value, onChange, onEnterPress }: any) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={(e: React.KeyboardEvent) =>
        e.key === 'Enter' && onEnterPress()
      }
      data-testid="search-input"
    />
  )
}));

vi.mock('../Button/Button', () => ({
  __esModule: true,
  default: ({ text, onClick }: any) => (
    <button onClick={onClick} data-testid="search-button">
      {text}
    </button>
  )
}));

describe('SearchBar', () => {
  it('Should render the SearchBar component with all required props', () => {
    const mockProps = {
      searchQuery: 'Pikachu',
      onSearchChange: vi.fn(),
      onSearch: vi.fn(),
      onInitialFetch: vi.fn()
    };

    render(<SearchBar {...mockProps} />);

    const searchInput = screen.getByTestId('search-input');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Search Pokémon');
    expect(searchInput).toHaveValue('Pikachu');

    const searchButton = screen.getByTestId('search-button');
    expect(searchButton).toBeInTheDocument();
    expect(searchButton).toHaveTextContent('Search');

    fireEvent.change(searchInput, { target: { value: 'Charizard' } });
    expect(mockProps.onSearchChange).toHaveBeenCalled();

    fireEvent.click(searchButton);
    expect(mockProps.onSearch).toHaveBeenCalled();

    fireEvent.keyPress(searchInput, { key: 'Enter', code: 13, charCode: 13 });
    expect(mockProps.onSearch).toHaveBeenCalledTimes(2);
  });
  it('Should pass the searchQuery value to the SearchInputField', () => {
    const mockProps = {
      searchQuery: 'Charizard',
      onSearchChange: vi.fn(),
      onSearch: vi.fn(),
      onInitialFetch: vi.fn()
    };

    render(<SearchBar {...mockProps} />);

    const searchInput = screen.getByTestId('search-input');
    expect(searchInput).toHaveValue('Charizard');
  });
});

it('Should call onSearchChange when text is entered in the SearchInputField', () => {
  const mockProps = {
    searchQuery: '',
    onSearchChange: vi.fn(),
    onSearch: vi.fn(),
    onInitialFetch: vi.fn()
  };

  render(<SearchBar {...mockProps} />);

  const searchInput = screen.getByTestId('search-input');
  fireEvent.change(searchInput, { target: { value: 'Pikachu' } });

  expect(mockProps.onSearchChange).toHaveBeenCalledTimes(1);
  expect(mockProps.onSearchChange).toHaveBeenCalledWith(expect.any(Object));
});

it('Should trigger onSearch when the Search button is clicked', () => {
  const mockProps = {
    searchQuery: '',
    onSearchChange: vi.fn(),
    onSearch: vi.fn(),
    onInitialFetch: vi.fn()
  };

  render(<SearchBar {...mockProps} />);

  const searchButton = screen.getByTestId('search-button');
  fireEvent.click(searchButton);

  expect(mockProps.onSearch).toHaveBeenCalledTimes(1);
});

it('Should call onSearch when Enter key is pressed in the SearchInputField', () => {
  const mockProps = {
    searchQuery: '',
    onSearchChange: vi.fn(),
    onSearch: vi.fn(),
    onInitialFetch: vi.fn()
  };

  render(<SearchBar {...mockProps} />);

  const searchInput = screen.getByTestId('search-input');
  fireEvent.keyPress(searchInput, { key: 'Enter', code: 13, charCode: 13 });

  expect(mockProps.onSearch).toHaveBeenCalledTimes(1);
});

it('Should render the Button component with the correct text', () => {
  const mockProps = {
    searchQuery: '',
    onSearchChange: vi.fn(),
    onSearch: vi.fn(),
    onInitialFetch: vi.fn()
  };

  render(<SearchBar {...mockProps} />);

  const searchButton = screen.getByTestId('search-button');
  expect(searchButton).toBeInTheDocument();
  expect(searchButton).toHaveTextContent('Search');
});

it('Should update the UI when searchQuery changes', () => {
  const mockProps = {
    searchQuery: 'Initial',
    onSearchChange: vi.fn(),
    onSearch: vi.fn(),
    onInitialFetch: vi.fn()
  };

  const { rerender } = render(<SearchBar {...mockProps} />);

  const searchInput = screen.getByTestId('search-input');
  expect(searchInput).toHaveValue('Initial');

  mockProps.searchQuery = 'Updated';
  rerender(<SearchBar {...mockProps} />);

  expect(searchInput).toHaveValue('Updated');
});
