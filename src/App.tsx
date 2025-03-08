import React, { useState, useEffect, useCallback } from 'react';
import {
  useNavigate,
  useLocation,
  Outlet,
  useLoaderData
} from 'react-router-dom';
import Listeners from './Listeners/Listeners';
import { Item } from './components/Result/Result';
import { fetchData } from './API/fetchData';
import Header from './components/Header/Header';
import Flyout from './components/Flyout/Flyout';
import { useDispatch } from 'react-redux';
import { setLoading, setItems, setError } from './Store/resultsSlice';

import SearchBar from './components/Search/SearchBar';
import MainContent from './components/Main/MainContent';
import PaginationWrapper from './components/Pagination/PaginationWrapper';
import { ThemeSwitcher } from './components/ThemeSwitcher/ThemeSwitcher';
import useSearchQuery from './components/Search/useSearchQuery';
import { LoaderData } from './loaders/rootLoader';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [currentPageState, setCurrentPageState] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [selectedItem] = useState<Item | null>(null);
  const location = useLocation();
  const dispatch = useDispatch();

  const [searchQueryLocal] = useSearchQuery('');
  const {
    items,
    totalCount,
    currentPage: loaderCurrentPage,
    theme
  } = useLoaderData() as LoaderData;

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get('page') || '1', 10);
    setCurrentPageState(page);
  }, [location.search]);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    []
  );

  const handleSearch = useCallback(() => {
    const trimmedQuery = searchQuery.trim();
    setSearchQuery(trimmedQuery);
    setCurrentPageState(1);
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

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPageState(page);
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('page', page.toString());
      navigate(`/?${searchParams.toString()}`);
      setTriggerFetch(true);
    },
    [navigate, location.search]
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
      const { data, totalCount } = await fetchData(searchQueryLocal);
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
  }, [dispatch, handleDataFetched, handleError, searchQueryLocal]);
  useEffect(() => {
    handleInitialFetch();
  }, [handleInitialFetch]);

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

  // const handlePageChange = useCallback(
  //   (page: number) => {
  //     setCurrentPage(page);
  //     const searchParams = new URLSearchParams(location.search);
  //     searchParams.set('page', page.toString());
  //     navigate(`/?${searchParams.toString()}`);
  //     setTriggerFetch(true);
  //   },
  //   [navigate, location.search]
  // );

  return (
    <div className="container">
      <div className={`app ${theme}`}>
        <ThemeSwitcher />
        <Header />
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          onInitialFetch={handleInitialFetch}
        />
        <MainContent
          isLoading={isLoading}
          onItemClick={handleItemClick}
          onClick={handleMainClick}
        />
        <PaginationWrapper
          isLoading={isLoading}
          currentPage={currentPageState}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <Listeners
          searchQuery={searchQuery}
          page={currentPageState}
          pageSize={9}
          orderBy="relevance"
          select="all"
          onDataFetched={handleDataFetched}
          onError={handleError}
          triggerFetch={triggerFetch}
        />
        <Flyout />
        <Outlet />
      </div>
    </div>
  );
};

export default App;
