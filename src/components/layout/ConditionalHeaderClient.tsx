'use client';

import { usePathname } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Header from './Header';

export default function ConditionalHeaderClient() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const hideHeader =
    pathname === '/member/login' ||
    pathname === '/member/signup' ||
    pathname === '/member/signup/region-select';

  // Don't render anything on server side to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return hideHeader ? null : (
    <Suspense fallback={<div>Loading...</div>}>
      <Header />
    </Suspense>
  );
}
