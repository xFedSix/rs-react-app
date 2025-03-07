interface SearchInputFieldProps {
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterPress: (query: string) => void;
}

const SearchInputField: React.FC<SearchInputFieldProps> = ({
  placeholder,
  value,
  onChange,
  onEnterPress
}) => {
  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === 'Enter') {
      onEnterPress(value);
    }
  };

  return (
    <input
      className="input-field"
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyPress}
    />
  );
};

export default SearchInputField;
