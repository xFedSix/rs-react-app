import React, { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
  Outlet
} from 'react-router-dom';
import Button from './components/Button/Button';
import SearchInputField from './components/Search/SearchInputField';
import './App.css';
import Listeners from './Listeners/Listeners';
import { Item } from './components/Result/Result';
import { fetchData } from './API/fetchData';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import ItemDetails from './components/ItemDetails/ItemDetails';
import Pagination from './components/Pagination/Pagination';
import NotFound from './components/NotFound/NotFound';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get('page') || '1', 10);
    setCurrentPage(page);
  }, [location.search]);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    []
  );

  const handleSearch = useCallback(() => {
    const trimmedQuery = searchQuery.trim();
    setSearchQuery(trimmedQuery);
    setCurrentPage(1);
    setIsLoading(true);
    setTriggerFetch(true);
  }, [searchQuery]);

  const handleDataFetched = useCallback(
    ({ data, totalCount }: { data: Item[]; totalCount: number }) => {
      setItems(data);
      setIsLoading(false);
      setTriggerFetch(false);
      setError(null);
      setTotalPages(Math.ceil(totalCount / 9));
    },
    []
  );

  const handleError = useCallback((error: string) => {
    setError(error);
    setIsLoading(false);
    setTriggerFetch(false);
  }, []);

  const handleInitialFetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, totalCount } = await fetchData('');
      handleDataFetched({ data, totalCount });
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
      navigate(`/details/${item.id}`);
    },
    [navigate]
  );

  const handleCloseDetails = useCallback(() => {
    setSelectedItem(null);
    navigate('/');
  }, [navigate]);

  const handleMainClick = useCallback(() => {
    if (selectedItem) {
      handleCloseDetails();
    }
  }, [selectedItem, handleCloseDetails]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('page', page.toString());
      navigate(`/?${searchParams.toString()}`);
      setTriggerFetch(true);
    },
    [navigate, location.search]
  );

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
        <Outlet />
      </div>
      {!isLoading && items.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      <Listeners
        searchQuery={searchQuery}
        page={currentPage}
        onDataFetched={handleDataFetched}
        onError={handleError}
        triggerFetch={triggerFetch}
      />
    </div>
  );
};

const AppWrapper: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="details/:id" element={<ItemDetailsWrapper />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

const ItemDetailsWrapper: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    const itemId = location.pathname.split('/').pop();
    if (itemId) {
      const fetchItemDetails = async (id: string) => {
        const { data } = await fetchData(id);
        setSelectedItem(data);
      };
      fetchItemDetails(itemId);
    }
  }, [location.pathname]);

  const handleCloseDetails = useCallback(() => {
    setSelectedItem(null);
    navigate('/');
  }, [navigate]);

  return selectedItem ? (
    <ItemDetails item={selectedItem} onClose={handleCloseDetails} />
  ) : null;
};

export default AppWrapper;
