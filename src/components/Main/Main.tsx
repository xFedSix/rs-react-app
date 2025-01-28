import React from 'react';
import Loader from '../Loader/Loader';
import Result from '../Result/Result';
import { Item } from '../Result/Result';

export interface MainProps {
  isLoading: boolean;
  items: Item[] | Item;
  error: string | null;
}

const Main: React.FC<MainProps> = ({ isLoading, items, error }) => (
  <section className="Results-content">
    <h2>Results</h2>
    {isLoading ? <Loader /> : <Result items={items} error={error} />}
  </section>
);

export default Main;
