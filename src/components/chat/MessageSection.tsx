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
        <MessageItem
          message="모든 국민은 주거의 자유를 침해받지 아니한다. 주거에 대한 압수나 수색을 할 때에는 검사의 신청에 의하여 법관이 발부한 영장을 제시하여야 한다. 국회에서 의결된 법률안은 정부에 이송되어 15일 이내에 대통령이 공포한다.
                              대법원장은 국회의 동의를 얻어 대통령이 임명한다. 대통령은 제1항과 제2항의 처분 또는 명령을 한 때에는 지체없이 국회에 보고하여 그 승인을 얻어야 한다."
          isBot={false}
        />
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
