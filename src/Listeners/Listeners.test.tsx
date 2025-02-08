import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Listeners from './Listeners';

describe('Listeners', () => {
  it('renders without crashing', () => {
    render(
      <Listeners
        triggerFetch={false}
        searchQuery=""
        onDataFetched={() => {}}
        onError={() => {}}
      />
    );
  });
});
