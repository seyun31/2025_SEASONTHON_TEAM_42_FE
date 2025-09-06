'use client';

import Image from 'next/image';
interface MessageItemProps {
  message: string;
  isBot?: boolean;
  options?: string[];
  hideProfile?: boolean; // roadmap -> result 부분
  noTopMargin?: boolean; // roadmap -> result 부분
}

export default function MessageItem({
  message,
  isBot = false,
  hideProfile = false,
  noTopMargin = false,
}: MessageItemProps) {
  return (
    <div className={`${isBot && !noTopMargin ? 'mt-[2.4vh]' : ''}`}>
      {isBot && !hideProfile && (
        <div className="flex items-center gap-[1.25vw] mb-4">
          <Image
            src="/assets/Icons/ai-chat-profile.svg"
            alt="AI 프로필"
            width={0}
            height={0}
            className="flex-shrink-0 w-[2.71vw] h-[4.81vh]"
          />
          <div className="text-chat-message">캐릭터명</div>
        </div>
      )}
      <div className={`flex items-start gap-[1.25vw]`}>
        <div
          className={`max-w-[40.21vw] rounded-[24px] pt-6 pb-6 pl-5 pr-5 whitespace-pre-line ${
            isBot ? 'bg-primary-20 text-chat-message' : 'text-chat-message'
          }`}
          style={!isBot ? { backgroundColor: '#9FC2FF66' } : {}}
        >
          {message}
        </div>
      </div>
    </div>
  );
}
