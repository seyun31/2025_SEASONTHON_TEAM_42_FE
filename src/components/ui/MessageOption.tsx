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
      className={`flex items-center justify-center border-2 border-secondary1 rounded-[100px] overflow-hidden max-w-[60vw] xs:max-w-[60vw] md:max-w-[40vw] lg:max-w-[30vw] px-4 xs:px-4 md:px-4 lg:px-4 py-2 xs:py-2 md:py-2 lg:py-2 cursor-pointer transition-colors text-chat-message text-center text-[18px] xs:text-[18px] md:text-[18px] lg:text-[18px] ${
        isSelected ? 'bg-secondary1 text-black' : 'text-black'
      }`}
      style={!isSelected ? { backgroundColor: 'white' } : {}}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
