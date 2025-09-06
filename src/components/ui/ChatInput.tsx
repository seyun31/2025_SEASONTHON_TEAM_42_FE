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
      className="flex border-2 border-primary-90 rounded-[24px] overflow-hidden w-[51.875vw] max-w-full h-[12.96vh] relative"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="ai-chat-input flex-1 py-2 outline-none px-4"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-[2.81vw] h-[5vh] flex items-center justify-center disabled:opacity-50 hover:bg-gray-50 rounded-full transition-colors"
      >
        <Image
          src="/assets/Icons/send.svg"
          alt="전송"
          width={0}
          height={0}
          className="w-[2.5vw] h-[4.44vh]"
        />
      </button>
    </form>
  );
}
