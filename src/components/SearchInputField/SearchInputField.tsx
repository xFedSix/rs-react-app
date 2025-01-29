import { Component, ComponentProps, ReactNode } from 'react';
import './SearchInputField.scss';

interface SearchInputFieldProps {
  placeholder: string;
}

interface SearchInputFieldState {
  searchQuery: string;
}

class SearchInputField extends Component<
  ComponentProps<'input'> & SearchInputFieldProps,
  SearchInputFieldState
> {
  constructor(props: ComponentProps<'input'> & SearchInputFieldProps) {
    super(props);
    this.state = {
      searchQuery: ''
    };
  }

  componentDidMount() {
    const savedQuery = localStorage.getItem('searchQuery');
    if (savedQuery) {
      this.setState({ searchQuery: savedQuery });
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value;
    this.setState({ searchQuery });
    localStorage.setItem('searchQuery', searchQuery);
  };

  render(): ReactNode {
    return (
      <input
        className="input-field"
        type="text"
        placeholder={this.props.placeholder}
        value={this.state.searchQuery}
        onChange={this.handleChange}
      />
    );
  }
}

export default SearchInputField;
