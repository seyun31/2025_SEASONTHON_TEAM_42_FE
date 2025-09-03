import Image from 'next/image';

export default function ChatInput() {
  return (
    <div className="flex border-2 border-primary-90 rounded-[24px] overflow-hidden w-[51.875vw] h-[12.96vh] relative">
      <input
        type="text"
        placeholder="AI와 채팅을 통해 맞춤 직업을 알아보세요!"
        className="ai-chat-input flex-1 py-2 outline-none"
      />
      <button
        type="button"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-[2.81vw] h-[5vh] flex items-center justify-center"
      >
        <Image
          src="/assets/Icons/send.svg"
          alt="전송"
          width={0}
          height={0}
          className="w-[2.5vw] h-[4.44vh]"
        />
      </button>
    </div>
  );
}
