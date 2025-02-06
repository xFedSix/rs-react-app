import React, { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation
} from 'react-router-dom';
import Button from './components/Button/Button';
import SearchInputField from './components/Search/SearchInputField';
import './App.css';
import Listeners from './Listeners/Listeners';
import { Item } from './components/Result/Result';
import ThrowErrorButton from './components/Button/ThrowErrorButton';
import { fetchData } from './API/fetchData';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import ItemDetails from './components/ItemDetails.tsx/ItemDetails';
import NotFound from './components/NotFound/NotFound';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

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

  const handleItemClick = useCallback(
    (item: Item) => {
      setSelectedItem(item);
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('details', item.id.toString());
      navigate(`/?${searchParams.toString()}`);
    },
    [navigate, location.search]
  );

  const handleCloseDetails = useCallback(() => {
    setSelectedItem(null);
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('details');
    navigate(`/?${searchParams.toString()}`);
  }, [navigate, location.search]);

  const handleMainClick = useCallback(() => {
    if (selectedItem) {
      handleCloseDetails();
    }
  }, [selectedItem, handleCloseDetails]);

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
      <div className="main-content">
        <Main
          isLoading={isLoading}
          items={items}
          error={error}
          onItemClick={handleItemClick}
          onClick={handleMainClick}
        />
        {selectedItem && (
          <div className="details-section">
            <ItemDetails item={selectedItem} onClose={handleCloseDetails} />
          </div>
        )}
      </div>
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

const AppWrapper = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default AppWrapper;
