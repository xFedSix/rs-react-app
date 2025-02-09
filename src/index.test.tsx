import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';

import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

vi.mock('./App', () => ({
  __esModule: true,
  default: () => <div data-testid="app">App Component</div>
}));

vi.mock('./ErrorsHandlers/ErrorBoundary', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  )
}));

describe('Root component', () => {
  let rootElement: HTMLDivElement;

  beforeEach(() => {
    rootElement = document.createElement('div');
    rootElement.setAttribute('id', 'root');
    document.body.appendChild(rootElement);
  });

  afterEach(() => {
    document.body.removeChild(rootElement);
  });

  it('renders App inside ErrorBoundary', async () => {
    await act(async () => {
      await import('./index');
    });

    const renderedApp = rootElement.querySelector('[data-testid="app"]');
    const renderedErrorBoundary = rootElement.querySelector(
      '[data-testid="error-boundary"]'
    );

    expect(renderedErrorBoundary).toBeInTheDocument();
    expect(renderedApp).toBeInTheDocument();
  });
});
