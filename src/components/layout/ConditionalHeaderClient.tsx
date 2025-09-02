'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalHeaderClient() {
  const pathname = usePathname();
  const hideHeader =
    pathname === '/member/login' ||
    pathname === '/member/signup' ||
    pathname === '/member/signup/region-select';

  console.log('Current pathname:', pathname);

  return hideHeader ? null : <Header />;
}
