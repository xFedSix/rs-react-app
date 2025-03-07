import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { ThemeProvider } from './ThemeContext';
import { ThemeContext } from './theme-context';
import { THEME_KEY, getInitialTheme } from './ThemeTypes';
import React from 'react';

const TestComponent = () => {
  const { theme, toggleTheme } = React.useContext(ThemeContext)!;
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};
vi.mock('./ThemeTypes', () => ({
  THEME_KEY: 'test-theme',
  getInitialTheme: vi.fn(() => 'light')
}));

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    (getInitialTheme as Mock).mockImplementation(() => 'light');
  });

  it('should initialize with light theme by default', () => {
    (getInitialTheme as Mock).mockReturnValue('light');

    let contextValue: any;
    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    expect(contextValue.theme).toBe('light');
    expect(localStorage.getItem(THEME_KEY)).toBe('light');
  });

  it('should initialize with theme from localStorage', () => {
    localStorage.setItem(THEME_KEY, 'dark');
    (getInitialTheme as Mock).mockImplementation(() => 'dark');

    let contextValue: any;
    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    expect(contextValue.theme).toBe('dark');
  });

  it('should toggle theme correctly', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeDisplay = screen.getByTestId('current-theme');
    const toggleButton = screen.getByText('Toggle');

    expect(themeDisplay.textContent).toBe('light');
    expect(localStorage.getItem(THEME_KEY)).toBe('light');

    fireEvent.click(toggleButton);
    expect(themeDisplay.textContent).toBe('dark');
    expect(localStorage.getItem(THEME_KEY)).toBe('dark');

    fireEvent.click(toggleButton);
    expect(themeDisplay.textContent).toBe('light');
    expect(localStorage.getItem(THEME_KEY)).toBe('light');
  });

  it('should update localStorage when theme changes', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByText('Toggle');

    expect(localStorage.getItem(THEME_KEY)).toBe('light');

    fireEvent.click(toggleButton);
    expect(localStorage.getItem(THEME_KEY)).toBe('dark');
  });

  it('should provide correct context to children', () => {
    const TestReceiver = () => {
      const { theme } = React.useContext(ThemeContext)!;
      return <span data-testid="received-theme">{theme}</span>;
    };

    render(
      <ThemeProvider>
        <TestReceiver />
      </ThemeProvider>
    );

    expect(screen.getByTestId('received-theme').textContent).toBe('light');
  });

  it('should handle edge cases for theme values', () => {
    (getInitialTheme as Mock).mockReturnValue('unknown' as any);

    let contextValue: any;
    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );
    expect(contextValue.theme).toBe('unknown');
    expect(localStorage.getItem(THEME_KEY)).toBe('unknown');
  });
});
