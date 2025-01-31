import React from 'react';
import './Results.scss';

export interface Item {
  name: string;
  url?: string;
  base_happiness?: number;
  capture_rate?: number;
  color?: { name: string };
}

interface ResultsProps {
  items: Item[] | Item;
  error: string | null;
}

const ResultsItem: React.FC<ResultsProps> = ({ items, error }) => {
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
    <tr key={item.name}>
      <td>{item.name}</td>
      <td>
        {item.url ? (
          item.url
        ) : (
          <>
            Base Happiness:{' '}
            {item.base_happiness ? item.base_happiness : 'No information'},
            Capture Rate:{' '}
            {item.capture_rate ? item.capture_rate : 'No information'}, Color:{' '}
            {item.color ? item.color.name : 'No information'}
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
            : renderTableRows(items as Item)}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsItem;
