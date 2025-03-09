import { AppProps } from 'next/app';
import '../[[...slug]]/global.css';
import { ThemeProvider } from '../context/ThemeContext';
import { store } from '../Store/Store';
import { Provider } from 'react-redux';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
