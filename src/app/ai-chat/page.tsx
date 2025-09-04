'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AiChat() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ai-chat/intro');
  }, [router]);

  return null;
}
