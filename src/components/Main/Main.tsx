import Loader from '../Loader/Loader';
import Result, { Item } from '../Result/Result';

export interface MainProps {
  isLoading: boolean;
  items: Item[] | Item;
  error: string | null;
  onItemClick: (item: Item) => void;
  onClick: () => void;
}

const Main = ({ isLoading, items, error, onItemClick, onClick }: MainProps) => (
  <section className="Results-content" onClick={onClick}>
    <h2>Results</h2>
    {isLoading ? (
      <Loader />
    ) : (
      <Result items={items} error={error} onItemClick={onItemClick} />
    )}
  </section>
);

export default Main;
