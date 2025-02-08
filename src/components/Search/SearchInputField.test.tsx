import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchInputField from './SearchInputField';

// Mock local storage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key) => {
      delete store[key];
    }
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('SearchInputField', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders with placeholder', () => {
    render(
      <SearchInputField
        placeholder="Search Pokémon"
        value=""
        onChange={() => {}}
        onEnterPress={() => {}}
        onInitialFetch={() => {}}
      />
    );
    expect(screen.getByPlaceholderText('Search Pokémon')).toBeInTheDocument();
  });

  it('handles input change', () => {
    const handleChange = vitest.fn();
    render(
      <SearchInputField
        placeholder="Search Pokémon"
        value=""
        onChange={handleChange}
        onEnterPress={() => {}}
        onInitialFetch={() => {}}
      />
    );
    fireEvent.change(screen.getByPlaceholderText('Search Pokémon'), {
      target: { value: 'Pikachu' }
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('handles enter key press', () => {
    const handleEnterPress = vitest.fn();
    render(
      <SearchInputField
        placeholder="Search Pokémon"
        value=""
        onChange={() => {}}
        onEnterPress={handleEnterPress}
        onInitialFetch={() => {}}
      />
    );
    fireEvent.keyDown(screen.getByPlaceholderText('Search Pokémon'), {
      key: 'Enter',
      code: 'Enter'
    });
    expect(handleEnterPress).toHaveBeenCalledTimes(1);
  });

  it('saves the entered value to local storage on search', () => {
    const handleChange = vitest.fn();
    const handleEnterPress = () => {
      localStorage.setItem('searchQuery', 'Pikachu');
    };
    render(
      <SearchInputField
        placeholder="Search Pokémon"
        value=""
        onChange={handleChange}
        onEnterPress={handleEnterPress}
        onInitialFetch={() => {}}
      />
    );
    fireEvent.change(screen.getByPlaceholderText('Search Pokémon'), {
      target: { value: 'Pikachu' }
    });
    fireEvent.keyDown(screen.getByPlaceholderText('Search Pokémon'), {
      key: 'Enter',
      code: 'Enter'
    });
    expect(localStorage.getItem('searchQuery')).toBe('Pikachu');
  });

  it('retrieves the value from local storage upon mounting', async () => {
    localStorage.setItem('searchQuery', 'Pikachu');
    const handleInitialFetch = vitest.fn();
    await act(async () => {
      render(
        <SearchInputField
          placeholder="Search Pokémon"
          value={localStorage.getItem('searchQuery') || ''}
          onChange={() => {}}
          onEnterPress={() => {}}
          onInitialFetch={handleInitialFetch}
        />
      );
    });
    expect(screen.getByDisplayValue('Pikachu')).toBeInTheDocument();
  });
});
