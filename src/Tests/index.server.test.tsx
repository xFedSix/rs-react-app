import { getServerSideProps } from '../page-helper/index.server';
import { fetchItems } from '../utils/pokemonApi';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../utils/pokemonApi');

describe('getServerSideProps', () => {
  it('fetches initial data successfully', async () => {
    const mockData = {
      data: [
        {
          id: 'xy7-54',
          name: 'Magnezone',
          images: { small: '', large: '' },
          flavorText: ''
        }
      ],
      totalCount: 1
    };
    (fetchItems as vi.Mock).mockResolvedValue(mockData);

    const result = await getServerSideProps({} as any);

    expect(fetchItems).toHaveBeenCalledWith({
      searchQuery: '',
      page: 1,
      pageSize: 9,
      orderBy: '',
      select: ''
    });
    expect(result).toEqual({ props: { initialData: mockData } });
  });

  it('handles fetch errors and returns fallback props', async () => {
    (fetchItems as vi.Mock).mockRejectedValue(new Error('API error'));

    const result = await getServerSideProps({} as any);

    expect(result).toEqual({
      props: { initialData: { data: [], totalCount: 0 } }
    });
  });
});
