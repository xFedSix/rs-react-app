import { GetServerSideProps } from 'next';
import { fetchItems } from '../utils/pokemonApi';
import { AppProps } from '../types/types';

export const getServerSideProps: GetServerSideProps<AppProps> = async (
  context
) => {
  try {
    const initialData = await fetchItems({
      searchQuery: '',
      page: 1,
      pageSize: 9,
      orderBy: '',
      select: ''
    });

    return { props: { initialData } };
  } catch (error) {
    return { props: { initialData: { data: [], totalCount: 0 } } };
  }
};
