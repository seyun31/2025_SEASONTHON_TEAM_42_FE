import Image from 'next/image';

interface ChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: () => void;
  placeholder?: string;
}

export default function ChatInput({
  value = '',
  onChange,
  onSend,
  placeholder = 'AI와 채팅을 통해 맞춤 직업을 알아보세요!',
}: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && onSend) {
      onSend();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex border-2 border-primary-90 rounded-[16px] xs:rounded-[16px] md:rounded-[16px] lg:rounded-[24px] overflow-hidden w-[95vw] h-[6vh] xs:w-[100vw] xs:h-[6vh] md:w-[78.125vw] md:h-[10vh] lg:w-[51.875vw] lg:max-w-full lg:h-[10vh] relative"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="ai-chat-input flex-1 py-1 xs:py-1 md:py-2 lg:py-2 outline-none text-16px"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="absolute right-3 xs:right-4 top-1/2 transform -translate-y-1/2 w-[7vw] h-[3.5vh] xs:w-[15vw] xs:h-[4vh] md:w-[4.5vw] md:h-[5.5vh] lg:w-[2.81vw] lg:h-[5vh] flex items-center justify-center disabled:opacity-50 hover:bg-gray-50 rounded-full transition-colors"
      >
        <Image
          src="/assets/Icons/send.svg"
          alt="전송"
          width={0}
          height={0}
          className="w-[6vw] h-[4.5vh] xs:w-[6vw] xs:h-[4.5vh] md:w-[3.5vw] md:h-[4vh] lg:w-[2.5vw] lg:h-[4.44vh]"
        />
      </button>
    </form>
  );
}
