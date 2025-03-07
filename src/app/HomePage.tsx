import React from 'react';
import AppWrapper from './[[...slug]]/AppWrapper';
import { AppProps } from './types/types';

const HomePage: React.FC<AppProps> = ({ initialData }) => {
  return <AppWrapper initialData={initialData} />;
};

export default HomePage;
