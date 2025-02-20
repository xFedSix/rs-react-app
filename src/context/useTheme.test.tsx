import { render, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useTheme } from './useTheme';
import { ThemeProvider } from './ThemeContext';
import { useLayoutEffect } from 'react';

const TestComponent = () => {
  const { theme } = useTheme();
  return <div data-testid="theme">{theme}</div>;
};

vi.mock('./ThemeTypes', () => ({
  THEME_KEY: 'test-theme',
  getInitialTheme: vi.fn(() => 'light')
}));

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should return theme context when used within ThemeProvider', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByTestId('theme').textContent).toBe('light');
  });

  it('should throw error when used outside ThemeProvider', () => {
    const consoleError = vi.spyOn(console, 'error');
    consoleError.mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    );

    consoleError.mockRestore();
  });
  it('should provide correct context values', () => {
    let contextValue: any;

    const TestContextConsumer = ({
      onContextValue
    }: {
      onContextValue: (value: any) => void;
    }) => {
      const context = useTheme();
      useLayoutEffect(() => {
        onContextValue(context);
      }, [context, onContextValue]);
      return null;
    };

    render(
      <ThemeProvider>
        <TestContextConsumer
          onContextValue={(value) => (contextValue = value)}
        />
      </ThemeProvider>
    );

    expect(contextValue).toEqual({
      theme: 'light',
      toggleTheme: expect.any(Function)
    });
  });

  it('should update context value when theme changes', () => {
    let capturedToggle: () => void = () => {};

    const TestComponent = ({
      onToggle
    }: {
      onToggle: (toggle: () => void) => void;
    }) => {
      const context = useTheme();
      useLayoutEffect(() => {
        onToggle(context.toggleTheme);
      }, [context.toggleTheme, onToggle]);
      return <div>{context.theme}</div>;
    };

    const { container } = render(
      <ThemeProvider>
        <TestComponent
          onToggle={(toggle) => {
            capturedToggle = toggle;
          }}
        />
      </ThemeProvider>
    );

    expect(container.textContent).toBe('light');

    act(() => {
      capturedToggle();
    });

    expect(container.textContent).toBe('dark');
  });
  it('should handle invalid theme value from localStorage', () => {
    localStorage.setItem('test-theme', 'invalid');

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByTestId('theme').textContent).toBe('light');
  });

  it('should update localStorage on theme change', () => {
    let toggleTheme: () => void;

    const TestComponent = () => {
      const context = useTheme();
      useLayoutEffect(() => {
        toggleTheme = context.toggleTheme;
      }, [context.toggleTheme]);
      return <div>{context.theme}</div>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      toggleTheme!();
    });

    expect(localStorage.getItem('test-theme')).toBe('dark');
  });
});
