import React, { useEffect } from 'react';
import useSearchQuery from './useSearchQuery';

interface SearchInputFieldProps {
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterPress: () => void;
  onInitialFetch: () => void;
}

const SearchInputField: React.FC<SearchInputFieldProps> = ({
  placeholder,
  value,
  onChange,
  onEnterPress,
  onInitialFetch
}) => {
  const [searchQuery, handleChange] = useSearchQuery(value);

  useEffect(() => {
    if (searchQuery) {
      onChange({
        target: { value: searchQuery }
      } as React.ChangeEvent<HTMLInputElement>);
      setTimeout(() => {
        onEnterPress();
      }, 0);
    } else {
      onInitialFetch();
    }
  }, [searchQuery, onChange, onEnterPress, onInitialFetch]);

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === 'Enter') {
      onEnterPress();
    }
  };

  return (
    <input
      className="input-field"
      type="text"
      placeholder={placeholder}
      value={searchQuery}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
    />
  );
};

export default SearchInputField;
