import { useEffect, useCallback } from 'react';
import { fetchData } from '../API/fetchData';

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
  const handleFetchData = useCallback(async () => {
    try {
      const result = await fetchData(
        searchQuery,
        page,
        pageSize,
        orderBy,
        select
      );
      onDataFetched(result);
      console.log('Data fetched:', result);
    } catch (error) {
      if (error instanceof Error) {
        onError(error.message);
      } else {
        const errorMessage = 'Unknown error occurred';
        onError(errorMessage);
      }
    }
  }, [searchQuery, page, pageSize, orderBy, select, onDataFetched, onError]);

  useEffect(() => {
    if (triggerFetch) {
      handleFetchData();
    }
  }, [triggerFetch, handleFetchData]);
};

const Listeners: React.FC<ListenersProps> = (props) => {
  useFetchData(props);
  return null;
};

export default Listeners;
