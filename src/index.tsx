import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import AppWrapper from './AppWrapper';
import './index.css';

const rootElement = document.getElementById('root')!;

hydrateRoot(
  rootElement,
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
