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
      className={`flex items-center justify-center border-2 border-secondary4 rounded-[100px] overflow-hidden max-w-[10.42vw] px-4 py-2 cursor-pointer transition-colors text-chat-message-option ${
        isSelected ? 'bg-secondary4 text-white' : 'text-black'
      }`}
      style={!isSelected ? { backgroundColor: '#9FC2FFB2' } : {}}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
