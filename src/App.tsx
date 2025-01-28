import { Component, ReactNode } from 'react';
import Button from './components/Button/Button';
import SearchInputField from './components/SearchInputField/SearchInputField';
import './App.css';

class App extends Component {
  render(): ReactNode {
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
