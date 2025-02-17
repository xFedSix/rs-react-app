import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MainContent from './MainContent';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import resultsReducer from '../../Store/resultsSlice';

vi.mock('../Main/Main', () => ({
  __esModule: true,
  default: ({ isLoading, onItemClick, onClick }: any) => (
    <div data-testid="mock-main">
      <button onClick={() => onClick()}>Main Click</button>
      <button onClick={() => onItemClick({ id: 1, name: 'Test Item' })}>
        Item Click
      </button>
      {isLoading && <div>Loading...</div>}
    </div>
  )
}));

const createMockStore = () =>
  configureStore({
    reducer: {
      results: resultsReducer
    }
  });

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <Provider store={createMockStore()}>
      <MemoryRouter initialEntries={['/details/1']}>
        <Routes>
          <Route path="/" element={component}>
            <Route
              path="details/:id"
              element={<div data-testid="mock-details">Details</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('MainContent', () => {
  const defaultProps = {
    isLoading: false,
    onItemClick: vi.fn(),
    onClick: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithRouter(<MainContent {...defaultProps} />);
    expect(screen.getByTestId('mock-main')).toBeInTheDocument();
  });

  it('renders loading state correctly', () => {
    renderWithRouter(<MainContent {...defaultProps} isLoading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles item click', () => {
    renderWithRouter(<MainContent {...defaultProps} />);
    fireEvent.click(screen.getByText('Item Click'));
    expect(defaultProps.onItemClick).toHaveBeenCalledWith({
      id: 1,
      name: 'Test Item'
    });
  });

  it('handles main content click', () => {
    renderWithRouter(<MainContent {...defaultProps} />);
    fireEvent.click(screen.getByText('Main Click'));
    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  it('renders split view layout', () => {
    const { container } = renderWithRouter(<MainContent {...defaultProps} />);
    expect(container.querySelector('.split-view')).toBeInTheDocument();
    expect(container.querySelector('.main-content')).toBeInTheDocument();
    expect(container.querySelector('.details-panel')).toBeInTheDocument();
  });

  it('passes correct props to Main component', () => {
    renderWithRouter(<MainContent {...defaultProps} />);
    const mainComponent = screen.getByTestId('mock-main');
    expect(mainComponent).toBeInTheDocument();

    fireEvent.click(screen.getByText('Main Click'));
    expect(defaultProps.onClick).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Item Click'));
    expect(defaultProps.onItemClick).toHaveBeenCalled();
  });

  it('renders Outlet in details panel', () => {
    renderWithRouter(<MainContent {...defaultProps} />);
    const detailsPanel = screen.getByTestId('mock-details');
    expect(detailsPanel).toBeInTheDocument();
    expect(detailsPanel).toHaveTextContent('Details');
  });
});
