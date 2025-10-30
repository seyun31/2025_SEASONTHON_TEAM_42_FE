'use client';

interface MessageOptionCompleteProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function MessageOptionComplete({
  children,
  onClick,
}: MessageOptionCompleteProps) {
  return (
    <div
      className="flex items-center justify-center rounded-[100px] border-2 border-secondary4 overflow-hidden max-w-[35vw] xs:max-w-[30vw] md:max-w-[25vw] lg:max-w-[30vw] px-4 xs:px-4 md:px-4 lg:px-4 py-2 xs:py-2 md:py-2 lg:py-2 cursor-pointer transition-colors text-chat-message-option bg-secondary4 text-white text-[18px] xs:text-[18px] md:text-[18px] lg:text-[18px]"
      onClick={onClick}
    >
      {children}
    </div>
  );
}
