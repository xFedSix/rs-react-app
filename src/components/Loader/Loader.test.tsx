import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import Loader from './Loader';

describe('Loader', () => {
  it('renders without crashing', () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toHaveClass('loader');
  });

  it('contains the correct number of div elements', () => {
    const { container } = render(<Loader />);
    const ellipsisDivs = container.querySelectorAll('.lds-ellipsis > div');
    expect(ellipsisDivs.length).toBe(4);
  });
});
