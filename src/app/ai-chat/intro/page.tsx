'use client';

import { useRouter } from 'next/navigation';
import MessageItem from '@/components/ui/MessageItem';
import { aiChatFlow } from '@/data/ai-chat-list';
import ChatInput from '@/components/ui/ChatInput';

export default function AiChatIntro() {
  const router = useRouter();

  const handleStartClick = () => {
    router.push('/ai-chat/questions?step=1');
  };

  return (
    <div className="flex justify-center">
      <div className="w-[53vw] h-[69.81vh] overflow-y-auto scrollbar-hide mx-auto mt-[0.3vh] mb-[20vh] flex flex-col gap-4 px-4">
        {/* 인트로 메시지 */}
        <div className="flex justify-start">
          <MessageItem
            message={aiChatFlow.intro.messages.join('\n')}
            isBot={true}
          />
        </div>

        {/* 시작하기 버튼 */}
        <div className="flex justify-center">
          <button
            onClick={handleStartClick}
            className="px-6 py-3 bg-primary-40 text-white rounded-lg hover:bg-primary-50 transition-colors font-medium"
          >
            시작하기
          </button>
        </div>
      </div>

      {/* 입력창 */}
      <div className="absolute bottom-[4.8vh] w-full flex justify-center">
        <ChatInput value="" onChange={() => {}} onSend={() => {}} />
      </div>
    </div>
  );
}
