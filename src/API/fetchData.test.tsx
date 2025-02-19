import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { fetchData } from './fetchData';

describe('fetchData', () => {
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    vi.stubEnv('VITE_API_KEY', mockApiKey);
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('should throw an error when API key is missing', async () => {
    vi.stubEnv('VITE_API_KEY', '');

    await expect(fetchData()).rejects.toThrow('API key is missing');
  });

  it('should fetch data successfully with default parameters', async () => {
    const mockResponse = {
      data: [{ id: 1, name: 'Pikachu' }],
      count: 1
    };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse)
    });

    const result = await fetchData();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.pokemontcg.io/v2/cards?page=1&pageSize=9',
      {
        headers: {
          'X-Api-Key': mockApiKey
        }
      }
    );
    expect(result).toEqual({
      data: mockResponse.data,
      totalCount: mockResponse.count
    });
  });

  it('should handle non-Error objects in catch block', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue('String error');

    await expect(fetchData()).rejects.toThrow('An unknown error occurred');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.pokemontcg.io/v2/cards?page=1&pageSize=9',
      {
        headers: {
          'X-Api-Key': mockApiKey
        }
      }
    );
  });
  it('should handle undefined error in catch block', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(undefined);

    await expect(fetchData()).rejects.toThrow('An unknown error occurred');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.pokemontcg.io/v2/cards?page=1&pageSize=9',
      {
        headers: {
          'X-Api-Key': mockApiKey
        }
      }
    );
  });

  it('should handle orderBy parameter correctly', async () => {
    const mockResponse = {
      data: [{ id: 1, name: 'Pikachu' }],
      count: 1
    };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse)
    });

    const orderBy = 'name';
    await fetchData('', 1, 9, orderBy);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.pokemontcg.io/v2/cards?page=1&pageSize=9&orderBy=name',
      {
        headers: {
          'X-Api-Key': mockApiKey
        }
      }
    );
  });

  it('should include select parameter in the URL when provided', async () => {
    const mockResponse = {
      data: [{ id: 1, name: 'Pikachu' }],
      count: 1
    };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse)
    });

    const select = 'id,name,images.small';
    await fetchData('', 1, 9, '', select);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.pokemontcg.io/v2/cards?page=1&pageSize=9&select=id,name,images.small',
      {
        headers: {
          'X-Api-Key': mockApiKey
        }
      }
    );
  });

  it('should throw an error for non-OK network responses', async () => {
    const errorMessage = 'Bad Request';
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      statusText: errorMessage
    });

    await expect(fetchData()).rejects.toThrow(
      `Network response was not ok: ${errorMessage}`
    );

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.pokemontcg.io/v2/cards?page=1&pageSize=9',
      {
        headers: {
          'X-Api-Key': mockApiKey
        }
      }
    );
  });

  it('should return correct data structure with data and totalCount', async () => {
    const mockResponse = {
      data: [
        { id: 1, name: 'Bulbasaur' },
        { id: 2, name: 'Ivysaur' }
      ],
      totalCount: 2
    };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse)
    });

    const result = await fetchData();

    expect(result).toEqual({
      data: mockResponse.data,
      totalCount: mockResponse.totalCount
    });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.pokemontcg.io/v2/cards?page=1&pageSize=9',
      {
        headers: {
          'X-Api-Key': mockApiKey
        }
      }
    );
  });

  it('should handle empty response data gracefully', async () => {
    const mockResponse = {
      data: [],
      count: 0
    };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse)
    });

    const result = await fetchData();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.pokemontcg.io/v2/cards?page=1&pageSize=9',
      {
        headers: {
          'X-Api-Key': mockApiKey
        }
      }
    );
    expect(result).toEqual({
      data: [],
      totalCount: 0
    });
  });

  it('should throw an error for network failures', async () => {
    const networkError = new Error('Network failure');
    globalThis.fetch = vi.fn().mockRejectedValue(networkError);

    await expect(fetchData()).rejects.toThrow('Network failure');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.pokemontcg.io/v2/cards?page=1&pageSize=9',
      {
        headers: {
          'X-Api-Key': mockApiKey
        }
      }
    );
  });

  it('should use correct page and pageSize in the URL', async () => {
    const mockResponse = {
      data: [{ id: 1, name: 'Pikachu' }],
      count: 1
    };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse)
    });

    const page = 2;
    const pageSize = 20;
    await fetchData('', page, pageSize);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.pokemontcg.io/v2/cards?page=2&pageSize=20',
      {
        headers: {
          'X-Api-Key': mockApiKey
        }
      }
    );
  });
});
