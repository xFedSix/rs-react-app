import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import NotFound from './components/NotFound/NotFound';
import ItemDetailsWrapper from './components/ItemDetails/ItemDetailsWrapper';
import { rootLoader } from './loaders/rootLoader';
import { detailsLoader } from './loaders/detailsLoader';

export const router = {
  routes: [
    {
      path: '/',
      element: <App />,
      loader: rootLoader,
      errorElement: <NotFound />,
      children: [
        {
          path: 'details/:id',
          element: <ItemDetailsWrapper />,
          loader: detailsLoader
        }
      ]
    }
  ]
};
