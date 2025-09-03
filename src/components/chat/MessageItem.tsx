import Image from 'next/image';

interface MessageItemProps {
  message: string;
  isBot?: boolean;
}

export default function MessageItem({
  message,
  isBot = false,
}: MessageItemProps) {
  return (
    <div
      className={`flex items-start gap-[1.25vw] ${isBot ? 'mt-[2.4vh]' : 'mr-[4.8vh]'}`}
    >
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
        className={`max-w-[30.21vw] rounded-[24px] pt-6 pb-6 pl-5 pr-5 ${
          isBot ? 'bg-primary-20 text-chat-message' : 'text-chat-message'
        }`}
        style={!isBot ? { backgroundColor: '#9FC2FF66' } : {}}
      >
        {message}
      </div>
    </div>
  );
}
