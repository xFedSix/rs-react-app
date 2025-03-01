import {
  render,
  screen,
  waitFor,
  fireEvent,
  act
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ItemDetails from './ItemDetails';
import { Item } from '../Result/Result';

vi.mock('../Loader/Loader', () => ({
  __esModule: true,
  default: () => <div>Loading...</div>
}));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('ItemDetails', () => {
  const mockItem: Item = {
    id: '123',
    name: 'Test Item',
    images: { large: 'test-image-url', small: 'test-small-image-url' },
    flavorText: 'Test flavor text'
  };

  const mockData = {
    data: mockItem
  };

  beforeEach(() => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(mockData)
    });
  });

  it('renders without crashing and displays loading', async () => {
    await act(async () => {
      render(<ItemDetails item={mockItem} onClose={vi.fn()} />);
    });
  });

  it('displays item details after loading', async () => {
    await act(async () => {
      render(<ItemDetails item={mockItem} onClose={vi.fn()} />);
    });
    await waitFor(() =>
      expect(screen.getByText('Test Item')).toBeInTheDocument()
    );
    expect(screen.getByText('Test flavor text')).toBeInTheDocument();
    expect(screen.getByAltText('Test Item')).toHaveAttribute(
      'src',
      'test-image-url'
    );
  });

  it('displays error message when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Test error'));
    await act(async () => {
      render(<ItemDetails item={mockItem} onClose={vi.fn()} />);
    });
    await waitFor(() =>
      expect(screen.getByText('No details available.')).toBeInTheDocument()
    );
  });

  it('calls onClose when close button is clicked', async () => {
    const mockOnClose = vi.fn();
    await act(async () => {
      render(<ItemDetails item={mockItem} onClose={mockOnClose} />);
    });
    await waitFor(() =>
      expect(screen.getByText('Test Item')).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText('Close'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
