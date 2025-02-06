import './Result.scss';

export interface Item {
  id: number | string;
  name: string;
  images: {
    small: string;
    large: string;
  };
  flavorText: string;
}

export interface ResultsProps {
  items: Item[] | Item;
  error: string | null;
  onItemClick: (item: Item) => void;
}

const Result = ({ items, error, onItemClick }: ResultsProps) => {
  if (error) {
    return (
      <div className="results-container">
        <table className="results-table">
          <tbody>
            <tr>
              <td colSpan={2}>{error}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  if (!items) {
    return <div>No results found.</div>;
  }

  const renderTableRows = (item: Item) => (
    <tr key={item.id} onClick={() => onItemClick(item)}>
      <td>
        <img className="card-img" src={item.images.small} alt={item.name} />
      </td>
      <td>{item.name}</td>
      <td>
        {item.flavorText ? JSON.stringify(item.flavorText) : 'No information'}
      </td>
    </tr>
  );

  return (
    <div className="results-container">
      <table className="results-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Pokémon Name</th>
            <th>Pokémon Description</th>
          </tr>
        </thead>
        <tbody className="results-table-body">
          {Array.isArray(items)
            ? items.map(renderTableRows)
            : renderTableRows(items)}
        </tbody>
      </table>
    </div>
  );
};

export default Result;
