import { useEffect, useCallback } from 'react';
import { fetchData } from '../API/fetchData';
import { useDispatch } from 'react-redux';
import { setItems, setError, setLoading } from '../Store/resultsSlice';

interface ListenersProps {
  triggerFetch: boolean;
  searchQuery: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  select?: string;
  onDataFetched: (data: any) => void;
  onError: (error: string) => void;
}

const useFetchData = ({
  triggerFetch,
  searchQuery,
  page = 1,
  pageSize = 9,
  orderBy = '',
  select = '',
  onDataFetched,
  onError
}: ListenersProps) => {
  const dispatch = useDispatch();

  const handleFetchData = useCallback(async () => {
    dispatch(setLoading(true));

    try {
      const result = await fetchData(
        searchQuery,
        page,
        pageSize,
        orderBy,
        select
      );

      if (result.data) {
        dispatch(setItems(result.data));
        onDataFetched(result);
      } else {
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        dispatch(setError(errorMessage));
        onError(errorMessage);
      } else {
        const errorMessage = 'Unknown error occurred';
        dispatch(setError(errorMessage));
        onError(errorMessage);
      }
    } finally {
      dispatch(setLoading(false));
    }
  }, [
    searchQuery,
    page,
    pageSize,
    orderBy,
    select,
    onDataFetched,
    onError,
    dispatch
  ]);

  useEffect(() => {
    if (triggerFetch) {
      handleFetchData();
    }
  }, [triggerFetch, handleFetchData, page, searchQuery]);
};

const Listeners: React.FC<ListenersProps> = (props) => {
  useFetchData(props);
  return null;
};

export default Listeners;
