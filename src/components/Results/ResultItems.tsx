import React from 'react';

export interface Item {
  name: string;
  url?: string;
  base_happiness?: number;
  capture_rate?: number;
  color?: { name: string };
}

interface ResultsProps {
  items: Item[] | Item;
}

const ResultsItem: React.FC<ResultsProps> = ({ items }) => {
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
            <th>Item Name</th>
            <th>Item Description</th>
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
