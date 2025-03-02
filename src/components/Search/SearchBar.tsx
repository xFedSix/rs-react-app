import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearch
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for Pokémon..."
        value={searchQuery}
        onChange={onSearchChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={() => onSearch(searchQuery)}>Search</button>
    </div>
  );
};

export default SearchBar;
