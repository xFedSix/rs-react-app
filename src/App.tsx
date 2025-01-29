import { Component, ReactNode } from 'react';
import Button from './components/Button/Button';
import SearchInputField from './components/SearchInputField/SearchInputField';
import './App.css';
import Loader from './components/Loader/Loader';
import Results from './components/Results/Results';

interface AppState {
  isLoading: boolean;
  items: Array<{ id: number; title: string; description: string }>;
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isLoading: true,
      items: [
        { id: 1, title: 'Item 1', description: 'Description 1' },
        { id: 2, title: 'Item 2', description: 'Description 2' }
      ]
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 2000);
  }
  render(): ReactNode {
    const { isLoading, items } = this.state;

    if (isLoading) {
      return <Loader />;
    }
    return (
      <div className="container">
        <header className="App-header">
          <h1>Top controls</h1>
        </header>
        <main>
          <section className="Search-content">
            <SearchInputField placeholder="Search Input Field" />
            <Button text="Search" />
          </section>
          <section className="Results-content">
            <h2>Results</h2>
            <Results items={items} />
          </section>
        </main>
        <footer>
          <Button text="Error" />
        </footer>
      </div>
    );
  }
}

export default App;
