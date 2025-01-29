import React from 'react';

interface ResultsProps {
  items: Array<{ id: number; title: string; description: string }>;
}

const ResultsItem: React.FC<ResultsProps> = ({ items }) => {
  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          <h3>{item.title}</h3>

          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ResultsItem;
