import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Header', () => {
  it('renders header text', () => {
    render(<Header />);
    expect(screen.getByText('Pokémon Search')).toBeInTheDocument();
  });
});
