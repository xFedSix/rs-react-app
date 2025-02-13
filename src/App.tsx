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
import Pagination from './components/Pagination/Pagination';
import NotFound from './components/NotFound/NotFound';
import ItemDetailsWrapper from './components/ItemDetails/ItemDetailsWrapper';
import { useDispatch } from 'react-redux';
import { setLoading, setItems, setError } from './Store/resultsSlice';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerFetch, setTriggerFetch] = useState(false);
  const navigate = useNavigate();
  const [selectedItem] = useState<Item | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const dispatch = useDispatch();

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
    dispatch(setLoading(true));
    setTriggerFetch(true);
  }, [dispatch, searchQuery]);

  const handleDataFetched = useCallback(
    ({ data, totalCount }: { data: Item[]; totalCount: number }) => {
      dispatch(setItems(data));
      dispatch(setLoading(false));
      dispatch(setError(null));
      setTriggerFetch(false);
      setTotalPages(Math.ceil(totalCount / 9));
    },
    [dispatch]
  );

  const handleError = useCallback(
    (error: string) => {
      setError(error);
      dispatch(setLoading(false));
      setTriggerFetch(false);
    },
    [dispatch]
  );

  const handleInitialFetch = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const { data, totalCount } = await fetchData('');
      dispatch(setItems(data));
      dispatch(setLoading(false));
      dispatch(setError(null));
      setTotalPages(Math.ceil(totalCount / 9));
      handleDataFetched({ data, totalCount });
    } catch (error) {
      if (error instanceof Error) {
        handleError(error.message);
      } else {
        handleError(String(error));
      }
    }
  }, [dispatch, handleDataFetched, handleError]);

  const handleItemClick = useCallback(
    (item: Item) => {
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.set('details', item.id.toString());
      navigate({ search: newSearchParams.toString() });
    },
    [navigate, location.search]
  );

  const handleCloseDetails = useCallback(() => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.delete('details');
    navigate({ search: newSearchParams.toString() });
  }, [navigate, location.search]);

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
      <div className="split-view">
        <div className="main-content" onClick={handleMainClick}>
          <Main
            isLoading={isLoading}
            onItemClick={handleItemClick}
            onClick={handleMainClick}
          />
        </div>
        <div className="details-panel">
          <Outlet />
        </div>
      </div>
      {!isLoading && (
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
          <Route index element={<ItemDetailsWrapper />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppWrapper;
