import { Item } from '../types/types';

const BASE_URL = 'https://api.pokemontcg.io/v2/';

export const fetchItems = async ({
  searchQuery = '',
  page = 1,
  pageSize = 9,
  orderBy = '',
  select = ''
}: {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  select?: string;
}): Promise<{ data: Item[]; totalCount: number }> => {
  const queryString = searchQuery ? `q=name:${searchQuery}*` : '';
  const url = `${BASE_URL}cards?page=${page}&pageSize=${pageSize}${
    queryString ? `&${queryString}` : ''
  }${orderBy ? `&orderBy=${orderBy}` : ''}${select ? `&select=${select}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return {
    data: data.data || [],
    totalCount: data.totalCount || 0
  };
};

export const fetchItemDetails = async (itemId: string): Promise<Item> => {
  const url = `${BASE_URL}cards/${itemId}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as { data: Item };
  return data.data;
};
