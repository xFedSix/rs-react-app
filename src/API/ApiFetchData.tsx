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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        await fetchData(searchQuery, page, pageSize, orderBy, select);
      } catch (error) {
        console.error('Error occurred in fetchData:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAsync();
  }, [searchQuery, page, pageSize, orderBy, select]);

  if (loading) {
    return <Loader />;
  }

  return null;
};

export default ApiFetchData;
