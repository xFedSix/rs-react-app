import React from 'react';

export interface Item {
  id: number;
  name: string;
}

interface ResultsProps {
  items: Item[] | Item;
}

const ResultsItem: React.FC<ResultsProps> = ({ items }) => {
  console.log('Items:', items);

  if (!items) {
    return <div>No results found.</div>;
  }

  if (Array.isArray(items)) {
    if (items.length === 0) {
      return <div>No results found.</div>;
    }

    return (
      <div>
        {items.map((item) => (
          <div key={item.id}>
            <h3>{item.id}</h3>
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    );
  } else {
    const item = items as Item;
    return (
      <div>
        <h3>{item.id}</h3>
        <p>{item.name}</p>
      </div>
    );
  }
};

export default ResultsItem;
