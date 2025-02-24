import React, { useState } from 'react';
import SearchInputField from '../Search/SearchInputField';
import Button from '../Button/Button';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearch }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearchClick = () => {
    onSearch(localQuery);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(event.target.value);
  };

  return (
    <div className="search-container">
      <SearchInputField
        placeholder="Search Pokémon"
        value={localQuery}
        onChange={handleChange}
        onEnterPress={handleSearchClick}
      />
      <Button text="Search" onClick={handleSearchClick} />
    </div>
  );
};

export default SearchBar;
