import React from 'react';
import AppWrapper from '../[[...slug]]/AppWrapper';
import { Item, AppProps } from '../types/types';

const HomePage: React.FC<AppProps> = ({ initialData }) => {
  return (
    <div>
      <AppWrapper initialData={initialData} />
    </div>
  );
};

export default HomePage;
