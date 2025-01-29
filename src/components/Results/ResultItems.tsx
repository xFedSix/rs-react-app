import React from 'react';

export interface Item {
  id: number;
  name: string;
  description: string;
}
interface ResultsProps {
  items: Item[];
}
const ResultsItem: React.FC<ResultsProps> = ({ items }) => {
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
};

export default ResultsItem;
