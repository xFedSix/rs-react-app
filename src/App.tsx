import { Component, ReactNode } from 'react';
import Button from './components/Button/Button';
import SearchInputField from './components/Search/SearchInputField';
import './App.css';
import Listeners from './Listeners/Listeners';
import { Item } from './components/Result/Result';
import ThrowErrorButton from './components/Button/ThrowErrorButton';
import { fetchData } from './API/ApiFetchData';
import Header from './components/Header/Header';
import Main from './components/Main/Main';

interface AppState {
  isLoading: boolean;
  items: Item[];
  searchQuery: string;
  offset: number;
  limit: number;
  triggerFetch: boolean;
  error: string | null;
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isLoading: false,
      items: [],
      searchQuery: '',
      offset: 0,
      limit: 20,
      triggerFetch: false,
      error: null
    };
  }
  throwError = () => {
    throw new Error('Test error');
  };
  componentDidMount() {
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 2000);
  }

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchQuery: event.target.value });
  };

  handleSearch = () => {
    const trimmedQuery = this.state.searchQuery.trim();
    this.setState({
      searchQuery: trimmedQuery,
      isLoading: true,
      triggerFetch: true
    });
  };

  handleDataFetched = (data: Item[]) => {
    this.setState({
      items: data,
      isLoading: false,
      triggerFetch: false,
      error: null
    });
  };
  handleInitialFetch = async () => {
    this.setState({ isLoading: true });
    try {
      const data = await fetchData('');
      this.handleDataFetched(data);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(error.message);
      } else {
        this.handleError(String(error));
      }
    }
  };

  handleError = (error: string) => {
    this.setState({ error, isLoading: false, triggerFetch: false });
  };

  render(): ReactNode {
    const { isLoading, items, searchQuery, triggerFetch, error } = this.state;

    return (
      <div className="container">
        <Header />
        <div className="search-container">
          <SearchInputField
            placeholder="Search Pokémon"
            value={searchQuery}
            onChange={this.handleSearchChange}
            onEnterPress={this.handleSearch}
            onInitialFetch={this.handleInitialFetch}
          />
          <Button text="Search" onClick={this.handleSearch} />
        </div>
        <Main isLoading={isLoading} items={items} error={error} />
        <ThrowErrorButton />
        <Listeners
          searchQuery={searchQuery}
          onDataFetched={this.handleDataFetched}
          onError={this.handleError}
          triggerFetch={triggerFetch}
        />
      </div>
    );
  }
}

export default App;
