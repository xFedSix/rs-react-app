import { Component, ReactNode } from 'react';
import Button from './components/Button/Button';
import SearchInputField from './components/SearchInputField/SearchInputField';
import './App.css';
import Loader from './components/Loader/Loader';
import ResultsItem from './components/Results/ResultItems';
import Listeners from './Listeners/Listeners';
import { Item } from './components/Results/ResultItems';
import ThrowErrorButton from './components/Button/ThrowErrorButton';
import { fetchData } from './API/ApiFetchData';

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
      const data = await fetchData('', 'pokemon', 0, 20);
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

  throwError = () => {
    throw new Error('Test error');
  };

  render(): ReactNode {
    const { isLoading, items, searchQuery, triggerFetch, error } = this.state;

    return (
      <div className="container">
        <header className="App-header">
          <h1>Pokémon Search</h1>
        </header>
        <main>
          <section className="search-content">
            <SearchInputField
              placeholder="Search Pokémon"
              value={searchQuery}
              onChange={this.handleSearchChange}
              onEnterPress={this.handleSearch}
              onInitialFetch={this.handleInitialFetch}
            />
            <Button text="Search" onClick={this.handleSearch} />
          </section>
          <section className="results-content">
            <h2>Results</h2>
            {isLoading ? (
              <Loader />
            ) : (
              <ResultsItem items={items} error={error} />
            )}
          </section>
          <ThrowErrorButton />
          <Listeners
            searchQuery={searchQuery}
            onDataFetched={this.handleDataFetched}
            onError={this.handleError}
            triggerFetch={triggerFetch}
            endpoint="pokemon"
          />
        </main>
      </div>
    );
  }
}

export default App;
