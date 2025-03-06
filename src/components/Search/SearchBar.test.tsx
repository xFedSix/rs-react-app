import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders the search input and button', () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(
      screen.getByPlaceholderText('Search for Pokémon...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('updates the input value on change', () => {
    render(<SearchBar onSearch={() => {}} />);
    const inputElement = screen.getByPlaceholderText('Search for Pokémon...');
    fireEvent.change(inputElement, { target: { value: 'Pikachu' } });
    expect(inputElement).toHaveValue('Pikachu');
  });

  it('calls onSearch with the trimmed query when the button is clicked', () => {
    const onSearchMock = vitest.fn();
    render(<SearchBar onSearch={onSearchMock} />);
    const inputElement = screen.getByPlaceholderText('Search for Pokémon...');
    const buttonElement = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(inputElement, { target: { value: '  Pikachu  ' } });
    fireEvent.click(buttonElement);

    expect(onSearchMock).toHaveBeenCalledWith('Pikachu');
    expect(onSearchMock).toHaveBeenCalledTimes(1);
  });

  it('calls onSearch with the trimmed query when Enter is pressed', () => {
    const onSearchMock = vitest.fn();
    render(<SearchBar onSearch={onSearchMock} />);
    const inputElement = screen.getByPlaceholderText('Search for Pokémon...');

    fireEvent.change(inputElement, { target: { value: '  Bulbasaur  ' } });
    fireEvent.keyDown(inputElement, { key: 'Enter' });

    expect(onSearchMock).toHaveBeenCalledWith('Bulbasaur');
    expect(onSearchMock).toHaveBeenCalledTimes(1);
  });
  it('calls onSearch once when Enter is pressed', () => {
    const onSearchMock = vitest.fn();
    render(<SearchBar onSearch={onSearchMock} />);
    const inputElement = screen.getByPlaceholderText('Search for Pokémon...');

    fireEvent.change(inputElement, { target: { value: 'Charizard' } });
    fireEvent.keyDown(inputElement, { key: 'Enter' });
    fireEvent.keyDown(inputElement, { key: 'Enter' });

    expect(onSearchMock).toHaveBeenCalledTimes(2);
  });
});
