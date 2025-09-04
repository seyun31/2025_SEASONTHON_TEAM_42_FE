'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AIChatJob() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ai-chat?chapter=job');
  }, [router]);

  return null;
}
