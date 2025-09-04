'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AiChat() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ai-chat/job');
  }, [router]);

  return null;
}
