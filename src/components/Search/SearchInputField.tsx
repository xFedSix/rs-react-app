import React, { useEffect } from 'react';
import useSearchQuery from './useSearchQuery';
import './SearchInputField.scss';

interface SearchInputFieldProps {
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterPress: (query: string) => void;
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
    onInitialFetch();
  }, [onInitialFetch]);

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === 'Enter') {
      onEnterPress(searchQuery);
    }
  };

  return (
    <input
      className="input-field"
      type="text"
      placeholder={placeholder}
      value={searchQuery}
      onChange={(event) => {
        handleChange(event);
        onChange(event);
      }}
      onKeyDown={handleKeyPress}
    />
  );
};

export default SearchInputField;
