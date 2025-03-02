'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const AppWrapper = dynamic(() => import('../[[...slug]]/App'), { ssr: false });

const ClientAppWrapper: React.FC = () => {
  return <AppWrapper />;
};

export default ClientAppWrapper;
