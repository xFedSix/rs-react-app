import React, { useCallback } from 'react';
import { useLoaderData, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading, setItems, setError } from './Store/resultsSlice';
import type { LoaderData } from './loaders/rootLoader';
import Header from './components/Header/Header';
import SearchBar from './components/Search/SearchBar';
import MainContent from './components/Main/MainContent';
import PaginationWrapper from './components/Pagination/PaginationWrapper';
import { ThemeSwitcher } from './components/ThemeSwitcher/ThemeSwitcher';
import Flyout from './components/Flyout/Flyout';
import { Item } from './components/Result/Result';
import { Outlet } from 'react-router-dom';

const App: React.FC = () => {
  const { items, totalCount, currentPage, searchQuery, theme } =
    useLoaderData() as LoaderData;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const totalPages = Math.ceil(totalCount / 9);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('q', query);
      searchParams.set('page', '1');
      navigate(`?${searchParams.toString()}`);
    },
    [navigate, location.search]
  );

  const handleSearch = useCallback(() => {
    dispatch(setLoading(true));
    const searchParams = new URLSearchParams(location.search);
    navigate(`?${searchParams.toString()}`);
  }, [dispatch, navigate, location.search]);

  const handleItemClick = useCallback(
    (item: Item) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('details', item.id.toString());
      navigate(`?${searchParams.toString()}`);
    },
    [navigate, location.search]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('page', page.toString());
      navigate(`?${searchParams.toString()}`);
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
          onInitialFetch={() => {}}
        />
        <MainContent
          isLoading={false}
          onItemClick={handleItemClick}
          onClick={() => {}}
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
