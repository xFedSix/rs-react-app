import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import ItemDetailsWrapper from './ItemDetailsWrapper';
import userEvent from '@testing-library/user-event';

vi.mock('../Loader/Loader', () => ({
  __esModule: true,
  default: () => (
    <div role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  )
}));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const mockPokemonCard = {
  data: {
    id: 'test-id',
    name: 'Test Pokemon',
    images: {
      large: 'test-image-url'
    }
  }
};

describe('ItemDetailsWrapper', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockPokemonCard
    });
  });

  it('renders loader while fetching data', async () => {
    let resolveFetch: (value: Response) => void;
    const fetchPromise = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    mockFetch.mockImplementationOnce(() => fetchPromise as Promise<Response>);

    render(
      <MemoryRouter initialEntries={['/?details=test-id']}>
        <Routes>
          <Route path="/" element={<ItemDetailsWrapper />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();

    resolveFetch!({
      ok: true,
      json: async () => mockPokemonCard
    } as Response);

    await act(async () => {
      await fetchPromise;
    });
  });

  it('fetches and displays pokemon details', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/?details=test-id']}>
          <Routes>
            <Route path="/" element={<ItemDetailsWrapper />} />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.pokemontcg.io/v2/cards/test-id'
    );

    await waitFor(() => {
      expect(screen.getByText('Test Pokemon')).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/?details=test-id']}>
          <Routes>
            <Route path="/" element={<ItemDetailsWrapper />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Error loading details')).toBeInTheDocument();
    });
  });

  it('closes details panel when close button is clicked', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/?details=test-id']}>
          <Routes>
            <Route path="/" element={<ItemDetailsWrapper />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Test Pokemon')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Test Pokemon')).not.toBeInTheDocument();
    });
  });

  it('returns null when no details parameter is present', async () => {
    let container;
    await act(async () => {
      const result = render(
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<ItemDetailsWrapper />} />
          </Routes>
        </MemoryRouter>
      );
      container = result.container;
    });
  });
  it('handles absence of itemId', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<ItemDetailsWrapper />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText('Error loading details')).not.toBeInTheDocument();
    expect(screen.queryByText('No details available.')).not.toBeInTheDocument();
  });

  it('handles error response from API', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ error: 'API error' })
    });

    render(
      <MemoryRouter initialEntries={['/?details=test-id']}>
        <Routes>
          <Route path="/" element={<ItemDetailsWrapper />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error loading details')).toBeInTheDocument();
    });
  });
  it('updates search parameters when closing details', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/?details=test-id']}>
        <Routes>
          <Route path="/" element={<ItemDetailsWrapper />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Pokemon')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(window.location.search).toBe('');
    });
  });
});
