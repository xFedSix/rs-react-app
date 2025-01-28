import { Component, ReactNode } from 'react';
import './Button.scss';

interface ButtonProps {
  text: string;
}

class Button extends Component<ButtonProps> {
  render(): ReactNode {
    return <button className="button">{this.props.text}</button>;
  }
}

export default Button;
