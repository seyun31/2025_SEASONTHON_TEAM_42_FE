'use client';

import MessageItem from '@/components/ui/MessageItem';
import MessageOption from '@/components/ui/MessageOption';

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
          <div
            className="max-w-[30.21vw] rounded-[24px] pt-6 pb-6 pl-5 pr-5"
            style={{ backgroundColor: '#9FC2FF66' }}
          >
            <div className="flex flex-wrap gap-2 justify-center">
              <MessageOption
                onClick={(selected) => console.log(`혼자서: ${selected}`)}
              >
                혼자서
              </MessageOption>
              <MessageOption
                onClick={(selected) => console.log(`여럿이서: ${selected}`)}
              >
                여럿이서
              </MessageOption>
              <MessageOption
                onClick={(selected) =>
                  console.log(`책상에 앉아서: ${selected}`)
                }
              >
                책상에 앉아서
              </MessageOption>
              <MessageOption
                onClick={(selected) =>
                  console.log(`몸을 움직이며: ${selected}`)
                }
              >
                몸을 움직이며
              </MessageOption>
              <MessageOption
                onClick={(selected) => console.log(`차분한: ${selected}`)}
              >
                차분한
              </MessageOption>
              <MessageOption
                onClick={(selected) => console.log(`선택지1: ${selected}`)}
              >
                선택지1
              </MessageOption>
              <MessageOption
                onClick={(selected) => console.log(`선택지2: ${selected}`)}
              >
                선택지2
              </MessageOption>
              <MessageOption
                onClick={(selected) =>
                  console.log(`엄청나게긴선택지예시: ${selected}`)
                }
              >
                엄청나게긴선택지예시
              </MessageOption>
            </div>
          </div>
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
