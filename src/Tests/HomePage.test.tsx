import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomePage from '../pages/HomePage';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../Store/Store';
import { ThemeProvider } from '../context/ThemeContext';
import { useRouter, useSearchParams } from 'next/router';

vi.mock('next/router', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn()
}));

describe('HomePage', () => {
  beforeEach(() => {
    (useRouter as vi.Mock).mockReturnValue({
      push: vi.fn(),
      query: {},
      pathname: '/'
    });
    (useSearchParams as vi.Mock).mockReturnValue(new URLSearchParams());
  });
  it('renders without crashing', () => {
    const initialData = { data: [], totalCount: 0 };
    render(
      <Provider store={store}>
        <ThemeProvider>
          <HomePage initialData={initialData} />
        </ThemeProvider>
      </Provider>
    );
    expect(screen.getByTestId('app')).toBeInTheDocument();
  });

  it('renders div', () => {
    const initialData = { data: [], totalCount: 0 };
    render(
      <Provider store={store}>
        <ThemeProvider>
          <HomePage initialData={initialData} />
        </ThemeProvider>
      </Provider>
    );
    expect(screen.getByTestId('app')).toBeInTheDocument();
  });
});
