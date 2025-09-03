import ChatInput from '@/components/chat/ChatInput';
import MessageItem from '@/components/chat/MessageItem';

export default function AiChat() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center pt-8 gap-4">
        <div>Ai 채팅 페이지</div>
        <MessageItem
          message="안녕하세요! AI 챗봇입니다. 어떤 도움이 필요하신가요?"
          isBot={true}
        />
        <MessageItem message="사용자 메시지 예시입니다." isBot={false} />
      </div>
      <div className="flex-1 flex flex-col items-center pt-8 gap-4">
        <div>Ai 채팅 페이지</div>
        <MessageItem
          message="안녕하세요! AI 챗봇입니다. 어떤 도움이 필요하신가요?"
          isBot={true}
        />
        <MessageItem message="사용자 메시지 예시입니다." isBot={false} />
      </div>
      <div className="flex-1 flex flex-col items-center pt-8 gap-4">
        <div>Ai 채팅 페이지</div>
        <MessageItem
          message="안녕하세요! AI 챗봇입니다. 어떤 도움이 필요하신가요?"
          isBot={true}
        />
        <MessageItem message="사용자 메시지 예시입니다." isBot={false} />
      </div>
      <div className="pt-[50px] flex justify-center">
        <ChatInput />
      </div>
    </div>
  );
}
