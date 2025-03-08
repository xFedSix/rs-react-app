import React, { useCallback, useEffect } from 'react';
import {
  useNavigate,
  useLocation,
  Outlet,
  useLoaderData
} from 'react-router-dom';
import Header from './components/Header/Header';
import Flyout from './components/Flyout/Flyout';
import { useDispatch } from 'react-redux';
import { setItems } from './Store/resultsSlice';
import SearchBar from './components/Search/SearchBar';
import MainContent from './components/Main/MainContent';
import PaginationWrapper from './components/Pagination/PaginationWrapper';
import { ThemeSwitcher } from './components/ThemeSwitcher/ThemeSwitcher';
import { rootLoader } from './loaders/rootLoader';
import { Item } from './components/Result/Result';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { items, totalCount, currentPage, searchQuery, theme } =
    useLoaderData<typeof rootLoader>();

  const totalPages = Math.ceil(totalCount / 9);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    dispatch(setItems(items));
  }, [dispatch, items]);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.set('q', event.target.value);
      newSearchParams.set('page', '1');
      navigate(`/?${newSearchParams.toString()}`);
    },
    [navigate, location.search]
  );

  const handleSearch = useCallback(() => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('page', '1');
    navigate(`/?${newSearchParams.toString()}`);
  }, [navigate, location.search]);

  const onInitialFetch = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get('page') || '1';
    const q = searchParams.get('q') || '';
    navigate(`/?page=${page}&q=${q}`);
  }, [navigate, location.search]);
  const handlePageChange = useCallback(
    (page: number) => {
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.set('page', page.toString());
      navigate(`/?${newSearchParams.toString()}`);
    },
    [navigate, location.search]
  );

  const handleItemClick = useCallback(
    (item: Item) => {
      navigate(`/details/${item.id}`);
    },
    [navigate]
  );
  const handleCloseDetails = useCallback(() => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.delete('details');
    navigate({ search: newSearchParams.toString() });
  }, [navigate, location.search]);

  const handleMainClick = useCallback(() => {
    handleCloseDetails();
  }, [handleCloseDetails]);

  return (
    <div className="container">
      <div className={`app ${theme}`}>
        <ThemeSwitcher />
        <Header />
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          onInitialFetch={onInitialFetch}
        />
        <MainContent
          isLoading={false}
          onItemClick={handleItemClick}
          onClick={handleMainClick}
        />
        <PaginationWrapper
          isLoading={false}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <Flyout />
        <Outlet />
      </div>
    </div>
  );
};

export default App;
