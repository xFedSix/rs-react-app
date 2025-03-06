import { useSelector } from 'react-redux';
import { RootState } from '../../Store/Store';
import Loader from '../Loader/Loader';
import Result from '../Result/Result';
import { Item } from '../../types/types';
import { useEffect } from 'react';

export interface MainProps {
  onItemClick: (item: Item) => void;
  isLoading: boolean;
}

const Main = ({ onItemClick, isLoading }: MainProps) => {
  const {
    items,
    isLoading: dataIsLoading,
    error
  } = useSelector((state: RootState) => state.results);
  useEffect(() => {}, [items, error, dataIsLoading]);

  return (
    <section className="Results-content">
      <h2>Results</h2>
      {dataIsLoading ? (
        <Loader />
      ) : (
        <Result items={items} error={error} onItemClick={onItemClick} />
      )}
    </section>
  );
};

export default Main;
