import React from 'react';
import AppWrapper from '../[[...slug]]/AppWrapper';
import { Item, AppProps } from '../types/types';
import CustomHead from './head';

const HomePage: React.FC<AppProps> = ({ initialData }) => {
  return (
    <div>
      <CustomHead
        title="Pokemon App"
        description="Search for pokemons!"
        keywords="pokemon, search, find"
      />
      <AppWrapper initialData={initialData} />
    </div>
  );
};

export default HomePage;
