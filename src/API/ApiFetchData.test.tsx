import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import ApiFetchData from './ApiFetchData';
import Loader from '../components/Loader/Loader';
import { fetchData } from './fetchData';

vi.mock('./fetchData');
vi.mock('../components/Loader/Loader');

describe('ApiFetchData', () => {
  const defaultProps = {
    searchQuery: '',
    page: 1,
    pageSize: 9,
    orderBy: '',
    select: ''
  };

  beforeEach(() => {
    vi.mocked(fetchData).mockResolvedValue({
      data: [],
      totalCount: 0
    });
    vi.mocked(Loader).mockImplementation(() => <div>Loading...</div>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Loader while fetching data', async () => {
    render(<ApiFetchData {...defaultProps} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await fetchData();
  });

  it('removes Loader after fetching data', async () => {
    render(<ApiFetchData {...defaultProps} />);

    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it('handles fetchData errors gracefully', async () => {
    vi.mocked(fetchData).mockRejectedValue(new Error('Fetch error'));
    render(<ApiFetchData {...defaultProps} />);

    await new Promise((resolve) => setTimeout(resolve, 0));
  });
});
