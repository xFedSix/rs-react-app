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

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 2000);
  }

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Search query:', event.target.value);
    this.setState({ searchQuery: event.target.value });
  };

  handleSearch = async () => {
    const trimmedQuery = this.state.searchQuery.trim();
    console.log('Search query:', trimmedQuery);

    this.setState({
      searchQuery: trimmedQuery,
      isLoading: true,
      triggerFetch: true
    });

    const { searchQuery, offset, limit } = this.state;
    try {
      const data = await fetchData(searchQuery, 'pokemon', offset, limit);
      this.setState({ items: data, isLoading: false, triggerFetch: false });
      console.log('Data fetched:', data);
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
          <Button text="Error" onClick={this.handleSearch} />
        </footer>
      </div>
    );
  }
}

export default App;
