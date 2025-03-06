import React, { useState, useEffect, useCallback, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState<string>('');
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('searchQuery');
      if (typeof saved === 'string' && saved !== '') {
        setInternalSearchQuery(saved);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && internalSearchQuery !== '') {
      localStorage.setItem('searchQuery', internalSearchQuery);
    }
  }, [internalSearchQuery]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInternalSearchQuery(event.target.value);
    },
    []
  );

  const handleSearch = useCallback(() => {
    const trimmedQuery = internalSearchQuery.trim();
    if (trimmedQuery !== '') {
      localStorage.setItem('searchQuery', trimmedQuery);
    }
    onSearch(trimmedQuery);
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
