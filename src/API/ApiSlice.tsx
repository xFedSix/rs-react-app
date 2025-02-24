import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Item } from '../components/Result/Result';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.pokemontcg.io/v2/' }),
  endpoints: (builder) => ({
    fetchItems: builder.query<
      { data: Item[]; totalCount: number },
      {
        searchQuery?: string;
        page: number;
        pageSize: number;
        orderBy: string;
        select: string;
      }
    >({
      query: ({ searchQuery, page, pageSize, orderBy, select }) => {
        const queryString = searchQuery ? `q=name:${searchQuery}*` : '';
        return `cards?page=${page}&pageSize=${pageSize}${queryString ? `&${queryString}` : ''}${orderBy ? `&orderBy=${orderBy}` : ''}${select ? `&select=${select}` : ''}`;
      }
    })
  })
});

export const { useFetchItemsQuery } = apiSlice;
