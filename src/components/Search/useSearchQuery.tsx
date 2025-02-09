import { useState, useEffect } from 'react';

const useSearchQuery = (initialQuery: string) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    const savedQuery = localStorage.getItem('searchQuery');
    if (savedQuery) {
      setSearchQuery(savedQuery);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    localStorage.setItem('searchQuery', query);
    setSearchQuery(query);
  };

  return [searchQuery, handleChange] as const;
};

export default useSearchQuery;
