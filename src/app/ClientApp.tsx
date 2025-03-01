'use client';

import dynamic from 'next/dynamic';

const AppWrapper = dynamic(() => import('./[[...slug]]/App'), { ssr: false });

export default function ClientApp() {
  return <AppWrapper />;
}
