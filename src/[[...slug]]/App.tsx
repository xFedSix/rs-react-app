import React, { useState, useEffect, useCallback } from 'react';
import { Item } from '../components/Result/Result';
import Header from '../components/Header/Header';
import Flyout from '../components/Flyout/Flyout';
import { useDispatch } from 'react-redux';
import { setItems, setError } from '../Store/resultsSlice';
import SearchBar from '../components/Search/SearchBar';
import MainContent from '../components/Main/MainContent';
import PaginationWrapper from '../components/Pagination/PaginationWrapper';
import { ThemeSwitcher } from '../components/ThemeSwitcher/ThemeSwitcher';
import { useTheme } from '../context/useTheme';
import ItemDetails from '../components/ItemDetails/ItemDetails';
import { fetchItems } from '../utils/pokemonApi';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';

export interface AppProps {
  initialData: { data: Item[]; totalCount: number };
}

const App: React.FC<AppProps> = ({ initialData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [data, setData] = useState<{ data: Item[]; totalCount: number } | null>(
    initialData
  );
  const [error, setErrorState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedQuery = localStorage.getItem('searchQuery');
      if (savedQuery !== null) {
        setSearchQuery(savedQuery);
      }
    }
  }, []);

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
    const fetchData = async () => {
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
      }
    };

    fetchData();
  }, [searchQuery, currentPage, dispatch]);
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
      router.push(`/?details=${item.id}`, undefined, { shallow: true });
    },
    [router]
  );

  const handleCloseDetails = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const handleMainClick = useCallback(() => {
    if (selectedItem) {
      handleCloseDetails();
    }
  }, [selectedItem, handleCloseDetails]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  return (
    <div className="container">
      <div data-testid="app" className={`app ${theme}`}>
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
          selectedItem={selectedItem}
          onCloseDetails={() => setSelectedItem(null)}
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
