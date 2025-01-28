import { Component, ComponentProps, ReactNode } from 'react';
import './SearchInputField.scss';

interface SearchInputFieldProps {
  placeholder: string;
}

class SearchInputField extends Component<
  ComponentProps<'input'> & SearchInputFieldProps
> {
  render(): ReactNode {
    return (
      <input
        className="input-field"
        type="text"
        placeholder={this.props.placeholder}
      />
    );
  }
}

export default SearchInputField;
