import MessageItem from '@/components/chat/MessageItem';

export default function MessageSection() {
  return (
    <div className="w-[66vw] h-[69.81vh] overflow-y-auto scrollbar-hide mx-auto mt-[15vh] mb-[20vh] flex flex-col gap-4 px-4">
      <div className="flex justify-start">
        <MessageItem
          message="안녕하세요! AI 챗봇입니다. 어떤 도움이 필요하신가요?"
          isBot={true}
        />
      </div>
      <div className="flex justify-end">
        <MessageItem message="사용자 메시지 예시입니다." isBot={false} />
      </div>
      <div className="flex justify-start">
        <MessageItem
          message="안녕하세요! AI 챗봇입니다. 어떤 도움이 필요하신가요?"
          isBot={true}
        />
      </div>
      <div className="flex justify-end">
        <MessageItem message="사용자 메시지 예시입니다." isBot={false} />
      </div>
      <div className="flex justify-start">
        <MessageItem
          message="안녕하세요! AI 챗봇입니다. 어떤 도움이 필요하신가요?"
          isBot={true}
        />
      </div>
      <div className="flex justify-end">
        <MessageItem message="사용자 메시지 예시입니다." isBot={false} />
      </div>
    </div>
  );
}
