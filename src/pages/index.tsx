import React from 'react';
import HomePage from './HomePage';
import { AppProps } from '../types';

const Index: React.FC<AppProps> = ({ initialData }) => {
  return <HomePage initialData={initialData} />;
};

export { getServerSideProps } from './index.server';
export default Index;
