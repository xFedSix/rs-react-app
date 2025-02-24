import React, { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation
} from 'react-router-dom';
import './App.css';
import { Item } from './components/Result/Result';
import Header from './components/Header/Header';
import Flyout from './components/Flyout/Flyout';
import NotFound from './components/NotFound/NotFound';
import ItemDetailsWrapper from './components/ItemDetails/ItemDetailsWrapper';
import { useDispatch } from 'react-redux';
import { setItems, setError } from './Store/resultsSlice';
import SearchBar from './components/Search/SearchBar';
import MainContent from './components/Main/MainContent';
import PaginationWrapper from './components/Pagination/PaginationWrapper';
import { ThemeSwitcher } from './components/ThemeSwitcher/ThemeSwitcher';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/useTheme';
import { useFetchItemsQuery } from './API/ApiSlice';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState(() => {
    const savedQuery = localStorage.getItem('searchQuery');
    return savedQuery !== null ? savedQuery : '';
  });
  const navigate = useNavigate();
  const [selectedItem] = useState<Item | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const { data, error, isLoading } = useFetchItemsQuery({
    searchQuery,
    page: currentPage,
    pageSize: 9,
    orderBy: '',
    select: ''
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get('page') || '1', 10);
    setCurrentPage(page);
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

  const handleSearch = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    setSearchQuery(trimmedQuery);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    if (data) {
      dispatch(setItems(data.data));
      setTotalPages(Math.ceil(data.totalCount / 9));
    }
    if (error) {
      dispatch(setError('Error loading data'));
    }
  }, [data, error, dispatch]);

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
    },
    [navigate, location.search]
  );

  return (
    <div className="container">
      <div className={`app ${theme}`}>
        <ThemeSwitcher />
        <Header />
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
        />
        <MainContent
          isLoading={isLoading}
          onItemClick={handleItemClick}
          onClick={handleMainClick}
        />
        <PaginationWrapper
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <Flyout />
      </div>
    </div>
  );
};

const AppWrapper: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<ItemDetailsWrapper />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default AppWrapper;
