import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, Mock } from 'vitest';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useTheme } from '../../context/useTheme';

vi.mock('../../context/useTheme');

describe('ThemeSwitcher', () => {
  it('should render component without errors', () => {
    (useTheme as Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn()
    });

    render(<ThemeSwitcher />);

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should display "Dark Mode" text next to the checkbox', () => {
    (useTheme as Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn()
    });

    render(<ThemeSwitcher />);
    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('Dark Mode');

    expect(checkbox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toContainElement(checkbox);
  });

  it('should have the checkbox unchecked by default when theme is light', () => {
    (useTheme as Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn()
    });

    render(<ThemeSwitcher />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should have the checkbox checked when theme is dark', () => {
    (useTheme as Mock).mockReturnValue({
      theme: 'dark',
      toggleTheme: vi.fn()
    });

    render(<ThemeSwitcher />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call toggleTheme function when checkbox is clicked', () => {
    const mockToggleTheme = vi.fn();
    (useTheme as Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme
    });

    render(<ThemeSwitcher />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should update checkbox state when theme changes externally', () => {
    let mockTheme = 'light';
    const mockToggleTheme = vi.fn();
    (useTheme as Mock).mockImplementation(() => ({
      theme: mockTheme,
      toggleTheme: mockToggleTheme
    }));

    const { rerender } = render(<ThemeSwitcher />);
    let checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    mockTheme = 'dark';
    rerender(<ThemeSwitcher />);
    checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should maintain state correctly after multiple rapid toggling', () => {
    const mockToggleTheme = vi.fn();
    let mockTheme = 'light';
    (useTheme as Mock).mockImplementation(() => ({
      theme: mockTheme,
      toggleTheme: () => {
        mockTheme = mockTheme === 'light' ? 'dark' : 'light';
        mockToggleTheme();
      }
    }));

    const { rerender } = render(<ThemeSwitcher />);
    const checkbox = screen.getByRole('checkbox');

    for (let i = 0; i < 5; i++) {
      fireEvent.click(checkbox);
      rerender(<ThemeSwitcher />);
    }

    expect(mockToggleTheme).toHaveBeenCalledTimes(5);
    expect(checkbox).toBeChecked();
    expect(mockTheme).toBe('dark');

    fireEvent.click(checkbox);
    rerender(<ThemeSwitcher />);
    expect(mockToggleTheme).toHaveBeenCalledTimes(6);
    expect(checkbox).not.toBeChecked();
    expect(mockTheme).toBe('light');
  });
});
