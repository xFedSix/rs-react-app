import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renders header', () => {
    render(<App />);
    const headerElement = screen.getByText(/Pokémon Search/i);
    expect(headerElement).toBeInTheDocument();
  });
});
