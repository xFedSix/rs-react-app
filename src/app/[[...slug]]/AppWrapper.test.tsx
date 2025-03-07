import React from 'react';
import { render, screen } from '@testing-library/react';
import AppWrapper from './AppWrapper';
import { AppProps } from './App';

vi.mock('./App', () => {
  const MockApp = ({ initialData }: AppProps) => (
    <div data-testid="mock-app">
      {initialData ? (
        <pre data-testid="initial-data">{JSON.stringify(initialData)}</pre>
      ) : null}
    </div>
  );
  return {
    default: MockApp
  };
});

describe('AppWrapper', () => {
  it('renders without crashing', () => {
    render(<AppWrapper />);
    expect(screen.getByTestId('mock-app')).toBeInTheDocument();
  });

  it('passes initialData to App', () => {
    const initialData = { name: 'Test Data', value: 123 };
    render(<AppWrapper initialData={initialData} />);
    const appElement = screen.getByTestId('mock-app');
    const passedData = screen.getByTestId('initial-data');
    expect(appElement).toBeInTheDocument();
    expect(passedData).toBeInTheDocument();
    expect(passedData.textContent).toEqual(JSON.stringify(initialData));
  });
  it('passes nothing if initialData is undefined', () => {
    render(<AppWrapper />);
    const appElement = screen.getByTestId('mock-app');
    const passedData = screen.queryByTestId('initial-data');
    expect(appElement).toBeInTheDocument();
    expect(passedData).toBeNull();
  });
});
