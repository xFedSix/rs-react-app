import express from 'express';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouterProvider } from 'react-router-dom/server';
import { router } from './router';
import App from './App';
import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Provider } from 'react-redux';
import { store } from './Store/Store';

const app = express();

app.get('*', async (req, res) => {
  const url = req.url;
  const context: any = {};
  const stream = renderToPipeableStream(
    <Provider store={store}>
      <ThemeProvider>
        <StaticRouterProvider
          router={router.routes}
          context={context}
          basename={url}
        >
          <App />
        </StaticRouterProvider>
      </ThemeProvider>
    </Provider>,
    {
      bootstrapScripts: ['index.js'],
      onShellReady() {
        res.statusCode = context.statusCode || 200;
        res.setHeader('Content-Type', 'text/html');
        res.write('<!DOCTYPE html>');
        stream.pipe(res);
      },
      onError(err) {
        console.error(err);
        res.statusCode = 500;
        res.send('<!doctype html><p>Loading...</p>');
      }
    }
  );
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

app.use(express.static('dist/public'));
