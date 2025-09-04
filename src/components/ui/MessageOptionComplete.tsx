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
      className="flex items-center justify-center border-2 border-secondary4 rounded-[100px] overflow-hidden max-w-[30vw] px-4 py-2 cursor-pointer transition-colors text-chat-message-option bg-secondary4 text-white"
      onClick={onClick}
    >
      {children}
    </div>
  );
}
