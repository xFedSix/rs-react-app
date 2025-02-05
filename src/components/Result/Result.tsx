import './Result.scss';

export interface Item {
  id: number | string;
  name: string;
  url?: string;
  base_happiness?: number;
  capture_rate?: number;
  color?: { name: string };
  flavorText: string;
}

export interface ResultsProps {
  items: Item[] | Item;
  error: string | null;
}

const Result = ({ items, error }: ResultsProps) => {
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
    <tr key={item.id}>
      <td>{item.name}</td>
      <td>
        {item.url ? (
          item.url
        ) : (
          <>
            {item.flavorText
              ? JSON.stringify(item.flavorText)
              : 'No information'}
          </>
        )}
      </td>
    </tr>
  );

  return (
    <div className="results-container">
      <table className="results-table">
        <thead>
          <tr>
            <th>Pokémon Name</th>
            <th>Pokémon Description</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(items)
            ? items.map(renderTableRows)
            : renderTableRows(items)}
        </tbody>
      </table>
    </div>
  );
};

export default Result;
