import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchData } from './fetchData';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('fetchData', () => {
  const apiKey = 'test-api-key';

  beforeEach(() => {
    import.meta.env.VITE_API_KEY = apiKey;
    mockFetch.mockReset();
  });

  it('constructs the correct URL and fetches data successfully', async () => {
    const mockData = {
      data: [{ id: '1', name: 'Test Card' }],
      totalCount: 1
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    });

    const result = await fetchData('Pikachu', 1, 9, 'name', 'id');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.pokemontcg.io/v2/cards?page=1&pageSize=9&q=name:Pikachu*&orderBy=name&select=id',
      {
        headers: {
          'X-Api-Key': apiKey
        }
      }
    );
    expect(result).toEqual(mockData);
  });

  it('throws an error when the response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found'
    });

    await expect(fetchData('Pikachu')).rejects.toThrow(
      'Network response was not ok: Not Found'
    );
  });

  it('handles errors correctly', async () => {
    const mockError = new Error('Fetch error');
    mockFetch.mockRejectedValueOnce(mockError);

    await expect(fetchData('Pikachu')).rejects.toThrow('Fetch error');
  });

  it('throws an error if API key is missing', async () => {
    delete import.meta.env.VITE_API_KEY;

    await expect(fetchData('Pikachu')).rejects.toThrow('API key is missing');
  });

  it('uses default parameters when no arguments are provided', async () => {
    const mockData = {
      data: [{ id: '1', name: 'Default Card' }],
      totalCount: 1
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    });

    const result = await fetchData();
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.pokemontcg.io/v2/cards?page=1&pageSize=9',
      {
        headers: {
          'X-Api-Key': apiKey
        }
      }
    );
    expect(result).toEqual(mockData);
  });

  it('handles missing totalCount correctly', async () => {
    const mockData = {
      data: [{ id: '1', name: 'Test Card' }],
      count: 42
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    });

    const result = await fetchData('Pikachu', 1, 9, 'name', 'id');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.pokemontcg.io/v2/cards?page=1&pageSize=9&q=name:Pikachu*&orderBy=name&select=id',
      {
        headers: {
          'X-Api-Key': apiKey
        }
      }
    );
    expect(result).toEqual({
      data: mockData.data,
      totalCount: 42
    });
  });

  it('handles missing totalCount and count correctly', async () => {
    const mockData = {
      data: [{ id: '1', name: 'Test Card' }]
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    });

    const result = await fetchData('Pikachu', 1, 9, 'name', 'id');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.pokemontcg.io/v2/cards?page=1&pageSize=9&q=name:Pikachu*&orderBy=name&select=id',
      {
        headers: {
          'X-Api-Key': apiKey
        }
      }
    );
    expect(result).toEqual({
      data: mockData.data,
      totalCount: 0
    });
  });
});
