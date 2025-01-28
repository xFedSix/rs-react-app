import { Component } from 'react';

interface ThrowErrorButtonState {
  throwError: boolean;
}

class ThrowErrorButton extends Component<{}, ThrowErrorButtonState> {
  constructor(props: {}) {
    super(props);
    this.state = { throwError: false };
  }

  handleClick = () => {
    this.setState({ throwError: true });
  };

  render() {
    if (this.state.throwError) {
      throw new Error('Test error from ThrowErrorButton');
    }

    return <button onClick={this.handleClick}>Throw Error</button>;
  }
}

export default ThrowErrorButton;
