import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import Main, { MainProps } from './Main';
import Loader from '../Loader/Loader';
import Result, { Item } from '../Result/Result';

// Mock Loader and Result components
vi.mock('../Loader/Loader', () => ({
  __esModule: true,
  default: () => <div>Loading...</div>
}));

vi.mock('../Result/Result', () => ({
  __esModule: true,
  default: ({
    items,
    error,
    onItemClick
  }: {
    items: Item[] | Item;
    error: string | null;
    onItemClick: (item: Item) => void;
  }) => (
    <div>
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          Results:{' '}
          {Array.isArray(items) ? (
            items.map((item: Item) => (
              <div key={item.id} onClick={() => onItemClick(item)}>
                {item.name}
              </div>
            ))
          ) : (
            <div>{items.name}</div>
          )}
        </div>
      )}
    </div>
  )
}));

describe('Main', () => {
  const mockItems: Item[] = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' }
  ];

  const defaultProps: MainProps = {
    isLoading: false,
    items: mockItems,
    error: null,
    onItemClick: vi.fn(),
    onClick: vi.fn()
  };

  it('renders loading state', () => {
    render(<Main {...defaultProps} isLoading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders results when not loading', () => {
    render(<Main {...defaultProps} />);
    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<Main {...defaultProps} error="Test error" />);
    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
  });

  it('handles item click', () => {
    render(<Main {...defaultProps} />);
    fireEvent.click(screen.getByText('Item 1'));
    expect(defaultProps.onItemClick).toHaveBeenCalledWith(mockItems[0]);
  });

  it('handles section click', () => {
    render(<Main {...defaultProps} />);
    fireEvent.click(screen.getByText('Results'));
    expect(defaultProps.onClick).toHaveBeenCalled();
  });
});
