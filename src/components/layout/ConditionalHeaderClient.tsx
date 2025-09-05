'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import Header from './Header';

export default function ConditionalHeaderClient() {
  const pathname = usePathname();
  const hideHeader =
    pathname === '/member/login' ||
    pathname === '/member/signup' ||
    pathname === '/member/signup/region-select';

  console.log('Current pathname:', pathname);

  return hideHeader ? null : (
    <Suspense fallback={<div>Loading...</div>}>
      <Header />
    </Suspense>
  );
}
