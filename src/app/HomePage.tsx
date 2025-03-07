import React from 'react';
import AppWrapper from './[[...slug]]/AppWrapper';
import { AppProps } from '../types/types';

const HomePage: React.FC<AppProps> = ({ initialData }) => {
  return (
    <div data-testid="app">
      <AppWrapper initialData={initialData} />
    </div>
  );
};

export default HomePage;
