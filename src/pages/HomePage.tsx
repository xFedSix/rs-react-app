import React from 'react';
import AppWrapper from '../[[...slug]]/AppWrapper';
import { Item } from '../components/Result/Result';

export interface AppProps {
  initialData: { data: Item[]; totalCount: number };
}

const HomePage: React.FC<AppProps> = ({ initialData }) => {
  return (
    <div>
      <AppWrapper initialData={initialData} />
    </div>
  );
};

export default HomePage;
