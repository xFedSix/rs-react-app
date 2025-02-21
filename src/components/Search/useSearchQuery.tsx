import { useState, useEffect, useCallback } from 'react';

const useSearchQuery = (initialQuery: string) => {
  const [searchQueryLocal, setSearchQuery] = useState<string>(() => {
    const saved = localStorage.getItem('searchQuery');
    return saved !== null ? saved : initialQuery;
  });

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const query = event.target.value;
      try {
        localStorage.setItem('searchQuery', query);
        setSearchQuery(query);
      } catch (error) {}
    },
    []
  );

  useEffect(() => {
    const saved = localStorage.getItem('searchQuery');
    if (saved && saved !== initialQuery) {
      const event = {
        target: { value: saved }
      } as React.ChangeEvent<HTMLInputElement>;
      handleChange(event);
    }
  }, [handleChange, initialQuery]);

  return [searchQueryLocal, handleChange] as const;
};

export default useSearchQuery;
