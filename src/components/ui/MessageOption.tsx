'use client';

interface MessageOptionProps {
  children: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function MessageOption({
  children,
  isSelected = false,
  onClick,
}: MessageOptionProps) {
  return (
    <div
      className={`flex items-center justify-center border-2 border-secondary1 rounded-[100px] overflow-hidden max-w-[30vw] px-4 py-2 cursor-pointer transition-colors text-chat-message ${
        isSelected ? 'bg-secondary1 text-black' : 'text-black'
      }`}
      style={!isSelected ? { backgroundColor: 'white' } : {}}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
