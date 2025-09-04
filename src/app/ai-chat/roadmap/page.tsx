'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AiChatRoadmap() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ai-chat?chapter=roadmap');
  }, [router]);

  return null;
}
