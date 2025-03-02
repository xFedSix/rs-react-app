import React from 'react';
import dynamic from 'next/dynamic';

const ClientAppWrapper = dynamic(() => import('./ClientApp'), {
  ssr: false
});

const HomePage: React.FC = () => {
  return (
    <div>
      <ClientAppWrapper />
    </div>
  );
};

export default HomePage;
