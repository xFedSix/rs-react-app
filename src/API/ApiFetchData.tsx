import { useState, useEffect } from 'react';
import Loader from '../components/Loader/Loader';
import { fetchData } from './fetchData';

const ApiFetchData = ({
  searchQuery = '',
  page = 1,
  pageSize = 9,
  orderBy = '',
  select = ''
}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAsync = async () => {
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
      } catch (error) {
        console.error('Error occurred in fetchData:', error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAsync();
  }, [searchQuery, page, pageSize, orderBy, select]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Fetched Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ApiFetchData;
