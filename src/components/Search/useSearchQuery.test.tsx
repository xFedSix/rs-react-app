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
  it('returns the initial query when local storage is empty', () => {
    const { result } = renderHook(() => useSearchQuery('initialQuery'));
    const [searchQuery] = result.current;
    expect(searchQuery).toBe('initialQuery');
  });
  it('sets the value from local storage if present', () => {
    localStorage.setItem('searchQuery', 'fromStorage');
    const { result } = renderHook(() => useSearchQuery('initialQuery'));
    const [searchQuery] = result.current;
    expect(searchQuery).toBe('fromStorage');
  });
});
