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
            src="/assets/Icons/ai-chat-profile.webp"
            alt="AI 프로필"
            width={52}
            height={52}
            className="flex-shrink-0 w-12 xs:w-11 md:w-10 lg:w-[52px] h-auto object-contain"
          />
          <div className="text-chat-message text-[16px] xs:text-[16px] md:text-[18px] lg:text-[18px]">
            꿈별이
          </div>
        </div>
      )}
      <div
        className={`${isBot ? 'ml-12 xs:ml-11 md:ml-10 lg:ml-[52px]' : 'ml-12 xs:ml-11 md:ml-10 lg:ml-[52px]'}`}
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
