import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from './ErrorBoundary';

describe('ErrorBoundary', () => {
  it('renders children without error', () => {
    render(
      <ErrorBoundary>
        <div>Child component</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Child component')).toBeInTheDocument();
  });

  it('renders error message on error', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  it('handles reset button click', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    act(() => {
      fireEvent.click(screen.getByText('Back'));
    });

    expect(screen.queryByText('Something went wrong.')).toBeInTheDocument();
  });
});
