import { useSelector } from 'react-redux';
import { RootState } from '../../Store/Store';
import Loader from '../Loader/Loader';
import Result, { Item } from '../Result/Result';
import { useEffect } from 'react';

export interface MainProps {
  onItemClick: (item: Item) => void;
  onClick: () => void;
  isLoading: boolean;
}

const Main = ({ onItemClick, onClick }: MainProps) => {
  const { items, isLoading, error } = useSelector(
    (state: RootState) => state.results
  );
  useEffect(() => {}, [items, error, isLoading]);

  return (
    <section className="Results-content" onClick={onClick}>
      <h2>Results</h2>
      {isLoading ? (
        <Loader />
      ) : (
        <Result items={items} error={error} onItemClick={onItemClick} />
      )}
    </section>
  );
};

export default Main;
