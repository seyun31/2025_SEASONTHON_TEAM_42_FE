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
    <div className="flex items-start gap-[1.25vw]">
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
        className={`max-w-[30.21vw] max-h-[15.56vh] rounded-[24px] p-4 ${
          isBot ? 'bg-primary-20 text-chat-message' : 'text-chat-message'
        }`}
        style={!isBot ? { backgroundColor: '#9FC2FF66' } : {}}
      >
        {message}
      </div>
    </div>
  );
}
