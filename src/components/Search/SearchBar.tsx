import React, { useState, useEffect, useCallback } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState<string>('');

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInternalSearchQuery(event.target.value);
    },
    []
  );

  const handleSearch = useCallback(() => {
    onSearch(internalSearchQuery.trim());
  }, [internalSearchQuery, onSearch]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch]
  );

  return (
    <div className="search-bar">
      <input
        type="text"
        data-testid="search-input"
        placeholder="Search for Pokémon..."
        value={internalSearchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button data-testid="search-button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
