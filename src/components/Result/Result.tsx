import React from 'react';
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
