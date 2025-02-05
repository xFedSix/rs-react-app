import Loader from '../Loader/Loader';
import Result, { Item } from '../Result/Result';

export interface MainProps {
  isLoading: boolean;
  items: Item[] | Item;
  error: string | null;
}

const Main = ({ isLoading, items, error }: MainProps) => (
  <section className="Results-content">
    <h2>Results</h2>
    {isLoading ? <Loader /> : <Result items={items} error={error} />}
  </section>
);

export default Main;
