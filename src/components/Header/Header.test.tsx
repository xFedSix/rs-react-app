import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

describe('Header', () => {
  it('renders header text', () => {
    render(<Header />);
    expect(screen.getByText('Pokémon Search')).toBeInTheDocument();
  });
});
