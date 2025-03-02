import React from 'react';
import { GetServerSideProps } from 'next';
import { fetchItems } from '../utils/pokemonApi';
import { Item } from '../components/Result/Result';
import HomePage, { AppProps } from './HomePage';

const Index: React.FC<AppProps> = ({ initialData }) => {
  return <HomePage initialData={initialData} />;
};

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

    return {
      props: {
        initialData
      }
    };
  } catch (error) {
    return {
      props: {
        initialData: { data: [], totalCount: 0 }
      }
    };
  }
};

export default Index;
