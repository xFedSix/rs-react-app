import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ItemDetails from './ItemDetails';
import { Item } from '../Result/Result';
import { fetchItemDetails } from '../../utils/pokemonApi';
import { useRouter } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}));

vi.mock('../../utils/pokemonApi', () => ({
  fetchItemDetails: vi.fn()
}));

describe('ItemDetails', () => {
  const mockItem: Item = {
    id: 'xy7-54',
    name: 'Magnezone',
    images: {
      small: 'https://images.pokemontcg.io/xy7/54.png',
      large: 'https://images.pokemontcg.io/xy7/54_hires.png'
    },
    flavorText: 'This is a test flavor text.'
  };

  beforeEach(() => {
    (useRouter as vi.Mock).mockReturnValue({
      push: vi.fn(),
      query: {},
      pathname: '/search'
    });
    vi.clearAllMocks();
  });

  it('renders the loader while fetching details', () => {
    (fetchItemDetails as vi.Mock).mockResolvedValue(new Promise(() => {}));
    render(<ItemDetails item={mockItem} onClose={() => {}} />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders "No details available" when there is no item prop', async () => {
    render(<ItemDetails item={null as unknown as Item} onClose={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText('No details available.')).toBeInTheDocument();
    });
  });
  it('renders "No details available" when there is no item.id', async () => {
    render(<ItemDetails item={{ ...mockItem, id: null }} onClose={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText('No details available.')).toBeInTheDocument();
    });
  });

  it('renders item details after successful fetch', async () => {
    (fetchItemDetails as vi.Mock).mockResolvedValue(mockItem);
    render(<ItemDetails item={mockItem} onClose={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText('Magnezone')).toBeInTheDocument();
    });
    expect(screen.getByAltText('Magnezone')).toHaveAttribute(
      'src',
      'https://images.pokemontcg.io/xy7/54_hires.png'
    );
    expect(screen.getByText('This is a test flavor text.')).toBeInTheDocument();
  });

  it('calls onClose and updates the router query when the close button is clicked', async () => {
    (fetchItemDetails as vi.Mock).mockResolvedValue(mockItem);
    const onCloseMock = vi.fn();
    const routerPushMock = vi.fn();
    (useRouter as vi.Mock).mockReturnValue({
      push: routerPushMock,
      query: { details: 'xy7-54' },
      pathname: '/search'
    });

    render(<ItemDetails item={mockItem} onClose={onCloseMock} />);
    await waitFor(() => {
      expect(screen.getByText('Magnezone')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
    expect(routerPushMock).toHaveBeenCalledWith(
      {
        pathname: '/search',
        query: {}
      },
      undefined,
      { shallow: true }
    );
  });

  it('calls fetchItemDetails with the correct id', async () => {
    (fetchItemDetails as vi.Mock).mockResolvedValue(mockItem);
    render(<ItemDetails item={mockItem} onClose={() => {}} />);

    await waitFor(() => {
      expect(fetchItemDetails).toHaveBeenCalledWith('xy7-54');
    });
    expect(fetchItemDetails).toHaveBeenCalledTimes(1);
  });
  it('should not call fetchItemDetails when item.id is missing', async () => {
    render(<ItemDetails item={{ ...mockItem, id: null }} onClose={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText('No details available.')).toBeInTheDocument();
    });
    expect(fetchItemDetails).not.toHaveBeenCalled();
  });
  it('handles fetch error', async () => {
    (fetchItemDetails as vi.Mock).mockRejectedValue(new Error('Fetch failed'));
    render(<ItemDetails item={mockItem} onClose={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText('No details available.')).toBeInTheDocument();
    });
  });
});
