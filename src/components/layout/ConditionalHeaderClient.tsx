'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalHeaderClient() {
  const pathname = usePathname();
  const hideHeader = pathname === '/member/login' || 'member/signup';

  console.log('Current pathname:', pathname);

  return hideHeader ? null : <Header />;
}
