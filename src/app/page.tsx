import React from 'react';
import HomePage from './HomePage';
import './styles/global.css';

const Page = () => {
  return <HomePage initialData={{ data: [], totalCount: 0 }} />;
};

export default Page;
