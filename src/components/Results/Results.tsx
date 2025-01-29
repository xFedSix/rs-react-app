import { Component, ReactNode } from 'react';
import './Results.css';

interface Item {
  id: number;
  title: string;
  description: string;
}

interface ResultsProps {
  items: Item[];
}

class Results extends Component<ResultsProps> {
  render(): ReactNode {
    const { items } = this.props;

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
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Results;
