import { LoaderFunctionArgs } from 'react-router-dom';
import { fetchData } from '../API/fetchData';
import { Item } from '../components/Result/Result';

export type LoaderData = {
  items: Item[];
  totalCount: number;
  currentPage: number;
  searchQuery: string;
  theme: string;
};

export async function rootLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get('q') || '';
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const theme = localStorage.getItem('theme') || 'light';

  try {
    const { data, totalCount } = await fetchData(searchQuery, page);

    return {
      items: data,
      totalCount,
      currentPage: page,
      searchQuery,
      theme
    };
  } catch (error) {
    throw new Error('Failed to load items');
  }
}
