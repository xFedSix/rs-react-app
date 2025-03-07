'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../Store/Store';
import { ThemeProvider } from '../context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
