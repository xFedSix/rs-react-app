import { Component } from 'react';
import { fetchData } from '../API/ApiFetchData';
import { Item } from '../components/Results/ResultItems';

interface ListenersProps {
  searchQuery: string;
  onDataFetched: (data: Item[]) => void;
  triggerFetch: boolean;
  endpoint: string;
}

interface ListenersState {
  data: Item[] | null;
  error: string | null;
}

class Listeners extends Component<ListenersProps, ListenersState> {
  constructor(props: ListenersProps) {
    super(props);
    this.state = {
      data: null,
      error: null
    };
  }

  componentDidUpdate(prevProps: ListenersProps) {
    if (
      this.props.triggerFetch &&
      prevProps.triggerFetch !== this.props.triggerFetch
    ) {
      console.log('Triggering data fetch');
      this.handleFetchData();
    }
  }

  handleFetchData = async () => {
    try {
      const { searchQuery, endpoint } = this.props;
      const result = await fetchData(searchQuery, endpoint, 0, 20);
      console.log('Fetched result:', result);
      this.setState({ data: result, error: null });
      this.props.onDataFetched(result);
    } catch (error) {
      if (error instanceof Error) {
        this.setState({ error: error.message });
      } else {
        this.setState({ error: 'An unknown error occurred' });
      }
    }
  };

  render() {
    const { error } = this.state;
    return <div>{error && <div>Error: {error}</div>}</div>;
  }
}

export default Listeners;
