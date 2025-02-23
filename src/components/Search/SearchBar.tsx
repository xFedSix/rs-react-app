import React from 'react';
import SearchInputField from '../Search/SearchInputField';
import Button from '../Button/Button';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (query: string) => void;
  onInitialFetch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearch,
  onInitialFetch
}) => {
  return (
    <div className="search-container">
      <SearchInputField
        placeholder="Search Pokémon"
        value={searchQuery}
        onChange={onSearchChange}
        onEnterPress={onSearch}
        onInitialFetch={onInitialFetch}
      />
      <Button text="Search" onClick={() => onSearch(searchQuery)} />
    </div>
  );
};

export default SearchBar;
