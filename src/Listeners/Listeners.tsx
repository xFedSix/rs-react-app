import { useState, useEffect, useCallback } from 'react';
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

const Listeners: React.FC<ListenersProps> = ({
  triggerFetch,
  searchQuery,
  page = 1,
  pageSize = 9,
  orderBy = '',
  select = '',
  onDataFetched,
  onError
}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchData = useCallback(async () => {
    try {
      const result = await fetchData(
        searchQuery,
        page,
        pageSize,
        orderBy,
        select
      );
      setData(result);
      setError(null);
      onDataFetched(result);
      console.log('Data fetched:', result);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        onError(error.message);
      } else {
        const errorMessage = 'Unknown error occurred';
        setError(errorMessage);
        onError(errorMessage);
      }
    }
  }, [searchQuery, page, pageSize, orderBy, select, onDataFetched, onError]);

  useEffect(() => {
    if (triggerFetch) {
      handleFetchData();
    }
  }, [
    triggerFetch,
    searchQuery,
    page,
    pageSize,
    orderBy,
    select,
    handleFetchData
  ]);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {data && <div>Data fetched successfully</div>}
    </div>
  );
};

export default Listeners;
