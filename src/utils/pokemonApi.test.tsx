import { fetchItems, fetchItemDetails } from './pokemonApi';
import { Item } from '../components/Result/Result';

global.fetch = vi.fn();

describe('pokemonApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchItems', () => {
    it('fetches items with default parameters', async () => {
      const mockData = {
        data: [
          { id: 'xy7-54', name: 'Magnezone', images: { small: '', large: '' } },
          { id: 'xy7-55', name: 'Magneton', images: { small: '', large: '' } }
        ],
        totalCount: 2
      };
      (fetch as vi.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const result = await fetchItems({});

      expect(fetch).toHaveBeenCalledWith(
        'https://api.pokemontcg.io/v2/cards?page=1&pageSize=9'
      );
      expect(result).toEqual({
        data: mockData.data,
        totalCount: mockData.totalCount
      });
    });

    it('fetches items with search query', async () => {
      const mockData = { data: [], totalCount: 0 };
      (fetch as vi.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      await fetchItems({ searchQuery: 'Pikachu' });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.pokemontcg.io/v2/cards?page=1&pageSize=9&q=name:Pikachu*'
      );
    });

    it('fetches items with custom page and page size', async () => {
      const mockData = { data: [], totalCount: 0 };
      (fetch as vi.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      await fetchItems({ page: 2, pageSize: 12 });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.pokemontcg.io/v2/cards?page=2&pageSize=12'
      );
    });

    it('fetches items with order by parameter', async () => {
      const mockData = { data: [], totalCount: 0 };
      (fetch as vi.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      });
      await fetchItems({ orderBy: 'name' });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.pokemontcg.io/v2/cards?page=1&pageSize=9&orderBy=name'
      );
    });
    it('fetches items with select parameter', async () => {
      const mockData = { data: [], totalCount: 0 };
      (fetch as vi.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      await fetchItems({ select: 'id,name' });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.pokemontcg.io/v2/cards?page=1&pageSize=9&select=id,name'
      );
    });

    it('handles fetch error', async () => {
      (fetch as vi.Mock).mockResolvedValue({
        ok: false,
        status: 404
      });

      await expect(fetchItems({})).rejects.toThrow('HTTP error! status: 404');
    });

    it('returns empty array and 0 totalCount when data is undefined', async () => {
      (fetch as vi.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({})
      });

      const result = await fetchItems({});
      expect(result).toEqual({ data: [], totalCount: 0 });
    });
  });

  describe('fetchItemDetails', () => {
    it('fetches item details', async () => {
      const mockData = {
        data: {
          id: 'xy7-54',
          name: 'Magnezone',
          images: { small: '', large: '' }
        }
      };
      (fetch as vi.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const result = await fetchItemDetails('xy7-54');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.pokemontcg.io/v2/cards/xy7-54'
      );
      expect(result).toEqual(mockData.data);
    });

    it('handles fetch error', async () => {
      (fetch as vi.Mock).mockResolvedValue({
        ok: false,
        status: 500
      });

      await expect(fetchItemDetails('xy7-54')).rejects.toThrow(
        'HTTP error! status: 500'
      );
    });
  });
});
