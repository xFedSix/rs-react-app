import { Component, ReactNode } from 'react';
import Button from './components/Button/Button';
import SearchInputField from './components/SearchInputField/SearchInputField';
import './App.css';
import Loader from './components/Loader/Loader';
import ResultsItem, { Item } from './components/Results/ResultItems';
import Listeners from './Listeners/Listeners';

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
      isLoading: false,
      items: [],
      searchQuery: '',
      offset: 0,
      limit: 20,
      triggerFetch: false
    };
  }

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Search query:', event.target.value);
    this.setState({ searchQuery: event.target.value });
  };

  handleSearch = () => {
    console.log('Search button clicked');
    console.log('Search query:', this.state.searchQuery);

    this.setState({ isLoading: true, triggerFetch: true });
  };

  handleDataFetched = (data: Item[]) => {
    console.log('Data fetched:', data);
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
          <section className="Search-content">
            <SearchInputField
              placeholder="Search Pokémon"
              value={searchQuery}
              onChange={this.handleSearchChange}
            />
            <Button text="Search" onClick={this.handleSearch} />
          </section>
          <section className="Results-content">
            <h2>Results</h2>
            {isLoading ? <Loader /> : <ResultsItem items={items} />}
          </section>
          <Listeners
            searchQuery={searchQuery}
            onDataFetched={this.handleDataFetched}
            triggerFetch={triggerFetch}
            endpoint="pokemon"
          />
        </main>
        <footer>
          <Button text="Error" onClick={this.handleSearch} />
        </footer>
      </div>
    );
  }
}

export default App;
