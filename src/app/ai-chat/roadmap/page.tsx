'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AIChatRoadmap() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ai-chat?chapter=roadmap');
  }, [router]);

  return null;
}
