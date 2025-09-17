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
    <div
      className={`${isBot && !noTopMargin ? 'mt-[1.5vh] xs:mt-[2vh] md:mt-[2.4vh] lg:mt-[2.4vh]' : ''}`}
    >
      {isBot && !hideProfile && (
        <div className="flex items-center gap-[3vw] xs:gap-[3vw] md:gap-[1.5vw] lg:gap-[1.25vw] md:mb-2 lg:mb-2">
          <Image
            src="/assets/Icons/ai-chat-profile.svg"
            alt="AI 프로필"
            width={0}
            height={0}
            className="flex-shrink-0 w-[8vw] h-[6vh] xs:w-[6vw] xs:h-[5.5vh] md:w-[3.5vw] md:h-[5vh] lg:w-[2.71vw] lg:h-[4.81vh]"
          />
          <div className="text-chat-message text-[16px] xs:text-[16px] md:text-[18px] lg:text-[18px]">
            꿈별이
          </div>
        </div>
      )}
      <div
        className={`${isBot ? 'ml-[8vw] xs:ml-[6vw] md:ml-[3.5vw] lg:ml-[2.71vw]' : 'ml-[8vw] xs:ml-[6vw] md:ml-[3.5vw] lg:ml-[2.71vw]'}`}
      >
        <div
          className={`max-w-[60vw] xs:max-w-[75vw] md:max-w-[50vw] lg:max-w-[40.21vw] rounded-[24px] pt-6 pb-6 pl-5 pr-5 xs:pl-5 xs:pr-5 md:pl-4 md:pr-4 lg:pl-4 lg:pr-4 whitespace-pre-line text-base lg:text-lg ${
            isBot ? 'bg-primary-20 text-chat-message' : 'text-chat-message'
          }`}
          style={!isBot ? { backgroundColor: '#9FC2FF66' } : {}}
          dangerouslySetInnerHTML={{
            __html: message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
          }}
        />
      </div>
    </div>
  );
}
