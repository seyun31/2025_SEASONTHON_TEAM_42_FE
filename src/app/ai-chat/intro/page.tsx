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
        <div className="flex justify-end">
          <div
            className={`max-w-[30.21vw] rounded-[24px] pt-6 pb-6 pl-5 pr-5`}
            style={{ backgroundColor: '#9FC2FF66' }}
          >
            <button
              onClick={handleStartClick}
              className="flex items-center justify-center border-2 border-secondary4 rounded-[100px] max-w-[30vw] px-4 py-2 cursor-pointer transition-colors text-chat-message-option bg-secondary4 text-white"
            >
              시작하기
            </button>
          </div>
        </div>
      </div>

      {/* 입력창 */}
      <div className="absolute bottom-[4.8vh] w-full flex justify-center">
        <ChatInput value="" onChange={() => {}} onSend={() => {}} />
      </div>
    </div>
  );
}
