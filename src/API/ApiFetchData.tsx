import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchData } from './fetchData';
import { setItems, setLoading, setError } from '../Store/resultsSlice';
import Loader from '../components/Loader/Loader';

const ApiFetchData = ({
  searchQuery = '',
  page = 1,
  pageSize = 9,
  orderBy = '',
  select = ''
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setErrorState] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        setIsLoading(true);
        const data = await fetchData(
          searchQuery,
          page,
          pageSize,
          orderBy,
          select
        );
        dispatch(setItems(data.data));
        setErrorState(null);
      } catch (error) {
        setErrorState('Error loading data');
        dispatch(setError('Error loading data'));
      } finally {
        setIsLoading(false);
        dispatch(setLoading(false));
      }
    };

    fetchDataAsync();
  }, [searchQuery, page, pageSize, orderBy, select, dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return null;
};

export default ApiFetchData;
