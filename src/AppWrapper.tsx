import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Provider } from 'react-redux';
import { store } from './Store/Store';
import { router } from './router';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const AppWrapper: React.FC = () => {
  const clientRouter = createBrowserRouter(router.routes);
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={clientRouter} />
      </ThemeProvider>
    </Provider>
  );
};

export default AppWrapper;
