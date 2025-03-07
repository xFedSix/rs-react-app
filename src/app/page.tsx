import React from 'react';
import HomePage from './HomePage';
import './styles/global.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pokemon App',
  description: 'Search for pokemons!',
  icons: {
    icon: '/next.js.svg'
  }
};

const Page = () => {
  return <HomePage initialData={{ data: [], totalCount: 0 }} />;
};

export default Page;
