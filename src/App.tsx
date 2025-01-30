import { Component, ReactNode } from 'react';
import Button from './components/Button/Button';
import SearchInputField from './components/SearchInputField/SearchInputField';
import './App.css';
import Loader from './components/Loader/Loader';
import ResultsItem, { Item } from './components/Results/ResultItems';
import Listeners from './Listeners/Listeners';
import { fetchData } from './API/ApiFetchData';

interface AppState {
  isLoading: boolean;
  items: Item[];
  searchQuery: string;
  offset: number;
  limit: number;
  triggerFetch: boolean;
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isLoading: true,
      items: [],
      searchQuery: '',
      offset: 0,
      limit: 20,
      triggerFetch: false
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

  handleSearch = async () => {
    const trimmedQuery = this.state.searchQuery.trim();

    this.setState({
      searchQuery: trimmedQuery,
      isLoading: true,
      triggerFetch: true
    });

    const { searchQuery, offset, limit } = this.state;
    try {
      const data = await fetchData(searchQuery, 'pokemon', offset, limit);
      this.setState({ items: data, isLoading: false, triggerFetch: false });
    } catch (error) {
      this.setState({ isLoading: false, triggerFetch: false });
    }
  };

  handleDataFetched = (data: Item[]) => {
    this.setState({ items: data, isLoading: false, triggerFetch: false });
  };

  render(): ReactNode {
    const { isLoading, items, searchQuery, triggerFetch } = this.state;

    return (
      <div className="container">
        <header className="App-header">
          <h1>Pokémon Search</h1>
        </header>
        <main>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <section className="Search-content">
                <SearchInputField
                  placeholder="Search Pokémon"
                  value={searchQuery}
                  onChange={this.handleSearchChange}
                  onEnterPress={this.handleSearch}
                />
                <Button text="Search" onClick={this.handleSearch} />
              </section>
              <section className="Results-content">
                <h2>Results</h2>
                <ResultsItem items={items} />
              </section>
              <Listeners
                searchQuery={searchQuery}
                onDataFetched={this.handleDataFetched}
                triggerFetch={triggerFetch}
                endpoint="pokemon"
              />
            </>
          )}
        </main>
        <footer>
          <Button text="Throw Error" onClick={this.throwError} />
        </footer>
      </div>
    );
  }
}

export default App;
