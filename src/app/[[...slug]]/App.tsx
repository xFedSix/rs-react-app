import React, { useState, useEffect, useCallback } from 'react';
import { Item } from '../types/types';
import Header from '../components/Header/Header';
import Flyout from '../components/Flyout/Flyout';
import { useDispatch } from 'react-redux';
import { setItems, setError } from '../Store/resultsSlice';
import SearchBar from '../components/Search/SearchBar';
import MainContent from '../components/Main/MainContent';
import PaginationWrapper from '../components/Pagination/PaginationWrapper';
import { ThemeSwitcher } from '../components/ThemeSwitcher/ThemeSwitcher';
import { useTheme } from '../context/useTheme';
import { fetchItems } from '../utils/pokemonApi';
import { useRouter, useSearchParams } from 'next/navigation';

export interface AppProps {
  initialData: { data: Item[]; totalCount: number };
}

const App: React.FC<AppProps> = ({ initialData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchRequested, setIsSearchRequested] = useState(false);
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [data, setData] = useState<{ data: Item[]; totalCount: number } | null>(
    initialData
  );
  const [error, setErrorState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedQuery = localStorage.getItem('searchQuery');
      if (savedQuery !== null) {
        setSearchQuery(savedQuery);
        setIsSearchRequested(true);
      } else {
        setIsSearchRequested(true);
      }
    }
  }, []);

  const handleSearch = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      localStorage.setItem('searchQuery', trimmedQuery);
    } else {
      localStorage.removeItem('searchQuery');
    }
    setSearchQuery(trimmedQuery);
    setIsSearchRequested(true);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!isSearchRequested) return;
      setIsLoading(true);
      setErrorState(null);
      try {
        const result = await fetchItems({
          searchQuery,
          page: currentPage,
          pageSize: 9,
          orderBy: '',
          select: ''
        });
        setData(result);
        dispatch(setItems(result.data));
        setTotalPages(Math.ceil(result.totalCount / 9));
      } catch (err: any) {
        setErrorState(err.message || 'Error loading data');
        dispatch(setError(err.message || 'Error loading data'));
      } finally {
        setIsLoading(false);
        setIsSearchRequested(false);
      }
    };

    fetchData();
  }, [searchQuery, currentPage, dispatch, isSearchRequested]);
  useEffect(() => {
    if (!searchParams) {
      setSelectedItem(null);
      return;
    }
    const details = searchParams.get('details');
    if (details) {
      const item = data?.data.find((i) => i.id === details);
      if (item) {
        setSelectedItem(item);
      }
    } else {
      setSelectedItem(null);
    }
  }, [searchParams, data]);

  const handleItemClick = useCallback(
    (item: Item) => {
      setSelectedItem(item);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('page', currentPage.toString());
      newSearchParams.set('details', item.id);
      router.push(`/?${newSearchParams.toString()}`, undefined, {
        shallow: true
      });
    },
    [router, searchParams, currentPage]
  );

  const handleCloseDetails = useCallback(() => {
    setSelectedItem(null);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('details');
    router.push(`/?${newSearchParams.toString()}`, undefined, {
      shallow: true
    });
  }, [searchParams, router]);

  const handleMainClick = useCallback(() => {
    console.log('handleMainClick called', selectedItem);
    if (selectedItem) {
      setSelectedItem(null);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('details');
      router.push(`/?${newSearchParams.toString()}`, undefined, {
        shallow: true
      });
    }
  }, [selectedItem, searchParams, router]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      setIsSearchRequested(true);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('page', page.toString());

      const details = searchParams.get('details');
      if (details) {
        newSearchParams.set('details', details);
      }

      router.push(`/?${newSearchParams.toString()}`, undefined, {
        shallow: true
      });
      setTriggerFetch(true);
    },
    [searchParams, router]
  );
  return (
    <div className="container">
      <div data-testid="app" className={`app ${theme}`}>
        <ThemeSwitcher />
        <Header />
        <SearchBar onSearch={handleSearch} />
        <MainContent
          isLoading={isLoading}
          onItemClick={handleItemClick}
          selectedItem={selectedItem}
          onCloseDetails={handleCloseDetails}
          onMainClick={handleMainClick}
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

export default App;
