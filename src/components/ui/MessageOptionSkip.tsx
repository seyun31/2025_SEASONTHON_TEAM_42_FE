'use client';

interface MessageOptionSkipProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function MessageOptionSkip({
  children,
  onClick,
}: MessageOptionSkipProps) {
  return (
    <div
      className="flex items-center justify-center border-2 border-secondary4 rounded-[100px] overflow-hidden max-w-[30vw] px-4 py-2 cursor-pointer transition-colors text-chat-message-option bg-white text-gray-blue-50"
      onClick={onClick}
    >
      {children}
    </div>
  );
}
