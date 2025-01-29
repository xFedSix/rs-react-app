import { Component, ReactNode } from 'react';
import './SearchInputField.scss';

interface SearchInputFieldProps {
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterPress: () => void;
}

class SearchInputField extends Component<SearchInputFieldProps> {
  componentDidMount() {
    const savedQuery = localStorage.getItem('searchQuery');
    if (savedQuery) {
      this.props.onChange({
        target: { value: savedQuery }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value;
    localStorage.setItem('searchQuery', searchQuery);
    this.props.onChange(event);
  };

  render(): ReactNode {
    const { placeholder, value } = this.props;
    const handleKeyPress = (
      event: React.KeyboardEvent<HTMLInputElement>
    ): void => {
      if (event.key === 'Enter') {
        this.props.onEnterPress();
      }
    };
    return (
      <input
        className="input-field"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={this.handleChange}
        onKeyDown={handleKeyPress}
      />
    );
  }
}

export default SearchInputField;
