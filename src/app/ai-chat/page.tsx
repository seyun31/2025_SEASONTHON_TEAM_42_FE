'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AiChatPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ai-chat/job'); // 먼저 AI 채팅 직업 추천 페이지로 이동하도록 함
  }, [router]);

  return null;
}
