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
    console.group('Fetch Data Operation');
    console.log('Starting fetch operation with params:', {
      searchQuery,
      page,
      pageSize,
      orderBy,
      select
    });

    dispatch(setLoading(true));
    console.log('Loading state set to true');

    try {
      console.log('Fetching data...');
      const result = await fetchData(
        searchQuery,
        page,
        pageSize,
        orderBy,
        select
      );
      console.log('Raw API response:', result);

      if (result.data) {
        console.log('Data received successfully');
        console.log('Number of items:', result.data.length);
        console.log('First item:', result.data[0]);

        dispatch(setItems(result.data));
        console.log('Items dispatched to store');

        onDataFetched(result);
        console.log('onDataFetched callback executed');
      } else {
        console.warn('Received empty or invalid data structure:', result);
      }
    } catch (error) {
      console.group('Error in handleFetchData');
      console.error('Error details:', error);
      console.error(
        'Error stack:',
        error instanceof Error ? error.stack : 'No stack trace'
      );

      if (error instanceof Error) {
        const errorMessage = error.message;
        console.log('Dispatching error message:', errorMessage);
        dispatch(setError(errorMessage));
        onError(errorMessage);
      } else {
        const errorMessage = 'Unknown error occurred';
        console.log('Dispatching unknown error message');
        dispatch(setError(errorMessage));
        onError(errorMessage);
      }
      console.groupEnd();
    } finally {
      dispatch(setLoading(false));
      console.log('Loading state set to false');
      console.groupEnd();
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
    console.group('useFetchData Effect');
    console.log('Effect triggered with:', {
      triggerFetch,
      searchQuery,
      page,
      currentTime: new Date().toISOString()
    });

    if (triggerFetch) {
      console.log('Triggering fetch operation');
      handleFetchData();
    } else {
      console.log('Fetch operation skipped (triggerFetch is false)');
    }

    console.groupEnd();
  }, [triggerFetch, handleFetchData, page, searchQuery]);
};

const Listeners: React.FC<ListenersProps> = (props) => {
  console.log('Listeners component rendered with props:', props);
  useFetchData(props);
  return null;
};

export default Listeners;
