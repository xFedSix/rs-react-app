import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Result, { Item } from './Result';

const mockItem: Item = {
  id: 1,
  name: 'Pikachu',
  images: {
    small: 'pikachu-small.png',
    large: 'pikachu-large.png'
  },
  flavorText: 'Electric type Pokémon'
};

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

const mockItemsWithEmptyFlavorText: Item[] = [
  {
    id: 1,
    name: 'Bulbasaur',
    images: {
      small: 'bulbasaur-small.png',
      large: 'bulbasaur-large.png'
    },
    flavorText: ''
  },
  {
    id: 2,
    name: 'Squirtle',
    images: {
      small: 'squirtle-small.png',
      large: 'squirtle-large.png'
    },
    flavorText: ''
  }
];

const mockItemsWithUndefinedFlavorText: Item[] = [
  {
    id: 1,
    name: 'Bulbasaur',
    images: {
      small: 'bulbasaur-small.png',
      large: 'bulbasaur-large.png'
    },
    flavorText: undefined
  },
  {
    id: 2,
    name: 'Squirtle',
    images: {
      small: 'squirtle-small.png',
      large: 'squirtle-large.png'
    },
    flavorText: undefined
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

  it('displays "No results found" when items is null', () => {
    render(<Result items={[]} error={null} onItemClick={() => {}} />);
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('displays "No results found" when items is an empty array', () => {
    render(<Result items={[]} error={null} onItemClick={() => {}} />);
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('renders items with empty flavor text', () => {
    render(
      <Result
        items={mockItemsWithEmptyFlavorText}
        error={null}
        onItemClick={() => {}}
      />
    );
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Squirtle')).toBeInTheDocument();
    expect(screen.getAllByText('No information')).toHaveLength(2);
  });

  it('renders items with undefined flavor text', () => {
    render(
      <Result
        items={mockItemsWithUndefinedFlavorText}
        error={null}
        onItemClick={() => {}}
      />
    );
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Squirtle')).toBeInTheDocument();
    expect(screen.getAllByText('No information')).toHaveLength(2);
  });

  it('renders a single item', () => {
    render(<Result items={mockItem} error={null} onItemClick={() => {}} />);
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Electric type Pokémon')).toBeInTheDocument();
  });
});
