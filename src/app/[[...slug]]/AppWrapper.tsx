'use client';
import App from './App';
import { AppProps } from '../types/types';

const AppWrapper: React.FC<AppProps> = ({ initialData }) => {
  return <App initialData={initialData} />;
};

export default AppWrapper;
