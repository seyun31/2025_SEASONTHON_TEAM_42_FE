'use client';

import Image from 'next/image';
interface MessageItemProps {
  message: string;
  isBot?: boolean;
  options?: string[];
}

export default function MessageItem({
  message,
  isBot = false,
}: MessageItemProps) {
  return (
    <div className={`${isBot ? 'mt-[2.4vh]' : ''}`}>
      {isBot && (
        <div className="text-chat-message mb-2 ml-[4.5vw]">캐릭터명</div>
      )}
      <div className={`flex items-start gap-[1.25vw]`}>
        {isBot && (
          <Image
            src="/assets/Icons/ai-chat-profile.svg"
            alt="AI 프로필"
            width={0}
            height={0}
            className="flex-shrink-0 w-[2.71vw] h-[4.81vh]"
          />
        )}
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
