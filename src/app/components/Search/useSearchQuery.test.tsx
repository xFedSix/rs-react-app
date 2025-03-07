import { renderHook, act } from '@testing-library/react';
import useSearchQuery from './useSearchQuery';
import { vi, describe, it, expect, beforeEach } from 'vitest';

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

describe('useSearchQuery', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return the initial query', () => {
    const initialQuery = 'initial';
    const { result } = renderHook(() => useSearchQuery(initialQuery));
    expect(result.current[0]).toBe(initialQuery);
  });

  it('should save to localStorage on query change', () => {
    const initialQuery = '';
    const { result } = renderHook(() => useSearchQuery(initialQuery));
    act(() => {
      result.current[1]('newQuery');
    });
    expect(localStorage.getItem('searchQuery')).toBe('newQuery');
  });

  it('should load from localStorage', () => {
    localStorage.setItem('searchQuery', 'savedQuery');
    const { result } = renderHook(() => useSearchQuery(''));
    expect(result.current[0]).toBe('savedQuery');
  });
});
