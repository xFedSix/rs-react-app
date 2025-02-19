import { useState } from 'react';

const useSearchQuery = (initialQuery: string) => {
  const [searchQueryLocal, setSearchQuery] = useState(() => {
    const saved = localStorage.getItem('searchQuery');
    return saved !== null ? saved : initialQuery;
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    localStorage.setItem('searchQuery', query);
    setSearchQuery(query);
  };

  return [searchQueryLocal, handleChange] as const;
};

export default useSearchQuery;
