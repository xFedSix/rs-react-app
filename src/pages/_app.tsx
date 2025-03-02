import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../Store/Store';
import '../[[...slug]]/global.css';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
