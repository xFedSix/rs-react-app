import { Component } from 'react';
import { fetchData } from '../API/ApiFetchData';
import { Item } from '../components/Result/Result';

interface ListenersProps {
  searchQuery: string;
  onDataFetched: (data: Item[]) => void;
  triggerFetch: boolean;
  onError: (error: string) => void;
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
      this.handleFetchData();
    }
  }

  handleFetchData = async () => {
    try {
      const { searchQuery } = this.props;
      const result = await fetchData(searchQuery);
      this.setState({ data: result, error: null });
      this.props.onDataFetched(result);
      console.log('Data fetched:', result);
    } catch (error) {
      if (error instanceof Error) {
        this.setState({ error: error.message });
        this.props.onError(error.message);
      } else {
        const errorMessage = 'Unknown error occurred';
        this.setState({ error: errorMessage });
        this.props.onError(errorMessage);
      }
    }
  };

  render() {
    return null;
  }
}

export default Listeners;
