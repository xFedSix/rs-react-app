import React from 'react';
import HomePage from './HomePage';
import { AppProps } from '../types';
import { getServerSideProps } from './api/index.server';

const Index: React.FC<AppProps> = ({ initialData }) => {
  return <HomePage initialData={initialData} />;
};

export default Index;
