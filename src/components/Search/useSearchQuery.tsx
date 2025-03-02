import { useState, useEffect } from 'react';

const useSearchQuery = (initialQuery: string) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('searchQuery');
      if (typeof saved === 'string') {
        setSearchQuery(saved);
      }
    }
  }, [initialQuery]);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof searchQuery === 'string') {
      localStorage.setItem('searchQuery', searchQuery);
    }
  }, [searchQuery]);

  return [searchQuery, setSearchQuery] as const;
};

export default useSearchQuery;
