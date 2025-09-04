'use client';

import MessageItem from '@/components/ui/MessageItem';
import { aiChatFlow } from '@/data/ai-chat-list';
import ChatInput from '@/components/ui/ChatInput';

export default function AiChatResult() {
  return (
    <div className="w-[53vw] h-[69.81vh] overflow-y-auto scrollbar-hide mx-auto mt-[0.3vh] mb-[20vh] flex flex-col gap-4 px-4">
      {/* 완료 메시지 */}
      <div className="flex justify-start">
        <MessageItem
          message={aiChatFlow.outro.message.join('\n')}
          isBot={true}
        />
      </div>

      {/* 결과 카드들 (임시 예시) */}
      <div>결과카드들</div>

      {/* 입력창 */}
      <div className="absolute bottom-[4.8vh] w-full flex">
        <ChatInput value="" onChange={() => {}} onSend={() => {}} />
      </div>
    </div>
  );
}
