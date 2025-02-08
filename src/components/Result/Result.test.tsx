import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Result, { Item } from './Result';

const mockItems: Item[] = [
  {
    id: 1,
    name: 'Pikachu',
    images: {
      small: 'pikachu-small.png',
      large: 'pikachu-large.png'
    },
    flavorText: 'Electric type Pokémon'
  },
  {
    id: 2,
    name: 'Charmander',
    images: {
      small: 'charmander-small.png',
      large: 'charmander-large.png'
    },
    flavorText: 'Fire type Pokémon'
  }
];

describe('Result', () => {
  it('renders items', () => {
    render(<Result items={mockItems} error={null} onItemClick={() => {}} />);
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Charmander')).toBeInTheDocument();
  });

  it('handles item click', () => {
    const handleItemClick = vitest.fn();
    render(
      <Result items={mockItems} error={null} onItemClick={handleItemClick} />
    );
    fireEvent.click(screen.getByText('Pikachu'));
    expect(handleItemClick).toHaveBeenCalledTimes(1);
  });

  it('displays error message', () => {
    render(
      <Result items={[]} error="Error fetching data" onItemClick={() => {}} />
    );
    expect(screen.getByText('Error fetching data')).toBeInTheDocument();
  });
});
