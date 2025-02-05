import React, { useState, useEffect, useCallback } from 'react';
import Button from './components/Button/Button';
import SearchInputField from './components/Search/SearchInputField';
import './App.css';
import Listeners from './Listeners/Listeners';
import { Item } from './components/Result/Result';
import ThrowErrorButton from './components/Button/ThrowErrorButton';
import { fetchData } from './API/fetchData';
import Header from './components/Header/Header';
import Main from './components/Main/Main';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    []
  );

  const handleSearch = useCallback(() => {
    const trimmedQuery = searchQuery.trim();
    setSearchQuery(trimmedQuery);
    setIsLoading(true);
    setTriggerFetch(true);
  }, [searchQuery]);

  const handleDataFetched = useCallback((data: Item[]) => {
    setItems(data);
    setIsLoading(false);
    setTriggerFetch(false);
    setError(null);
  }, []);

  const handleError = useCallback((error: string) => {
    setError(error);
    setIsLoading(false);
    setTriggerFetch(false);
  }, []);

  const handleInitialFetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchData('');
      handleDataFetched(data);
    } catch (error) {
      if (error instanceof Error) {
        handleError(error.message);
      } else {
        handleError(String(error));
      }
    }
  }, [handleDataFetched, handleError]);

  return (
    <div className="container">
      <Header />
      <div className="search-container">
        <SearchInputField
          placeholder="Search Pokémon"
          value={searchQuery}
          onChange={handleSearchChange}
          onEnterPress={handleSearch}
          onInitialFetch={handleInitialFetch}
        />
        <Button text="Search" onClick={handleSearch} />
      </div>
      <Main isLoading={isLoading} items={items} error={error} />
      <ThrowErrorButton />
      <Listeners
        searchQuery={searchQuery}
        onDataFetched={handleDataFetched}
        onError={handleError}
        triggerFetch={triggerFetch}
      />
    </div>
  );
};

export default App;
