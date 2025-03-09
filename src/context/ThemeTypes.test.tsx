import { THEME_KEY, getInitialTheme } from './ThemeTypes';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ThemeTypes', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should have correct THEME_KEY', () => {
    expect(THEME_KEY).toBe('theme');
  });

  describe('getInitialTheme', () => {
    it('should return dark theme when stored in localStorage', () => {
      localStorage.setItem(THEME_KEY, 'dark');

      const result = getInitialTheme();

      expect(result).toBe('dark');
    });

    it('should return light theme when stored in localStorage', () => {
      localStorage.setItem(THEME_KEY, 'light');
      expect(getInitialTheme()).toBe('light');
    });

    it('should return light theme when no theme in localStorage', () => {
      expect(getInitialTheme()).toBe('light');
    });

    it('should return light theme for invalid stored value', () => {
      localStorage.setItem(THEME_KEY, 'invalid');
      expect(getInitialTheme()).toBe('light');
    });

    it('should call localStorage.getItem with correct key', () => {
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');

      getInitialTheme();

      expect(getItemSpy).toHaveBeenCalledWith(THEME_KEY);
    });

    it('should handle localStorage errors silently', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(getInitialTheme()).toBe('light');
    });
  });
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
});
