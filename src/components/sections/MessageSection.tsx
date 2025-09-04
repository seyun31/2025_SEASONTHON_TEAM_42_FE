'use client';

import MessageItem from '@/components/ui/MessageItem';
import MessageOptionItem from '../ui/MessageOptionItem';

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
        <div className="flex flex-col items-end gap-2">
          <MessageItem message="마음에 드는 선택지가 없다면 아래 채팅에 편하게 적어주세요!" />
          <MessageOptionItem
            options={[
              '혼자서',
              '여럿이서',
              '책상에 앉아서',
              '몸을 움직이며',
              '차분한',
              '선택지1',
              '선택지2',
              '엄청나게긴선택지예시',
            ]}
            onOptionClick={(option) => console.log(`옵션 선택: ${option}`)}
            onCompleteClick={() => console.log('선택완료 버튼 클릭')} // 임시
            placeholder="선택완료"
          />
        </div>
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
