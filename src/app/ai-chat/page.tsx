import ChatInput from '@/components/chat/ChatInput';
import MessageSection from '@/components/chat/MessageSection';

export default function AiChat() {
  return (
    <div className="h-screen flex flex-col relative">
      <MessageSection />
      <div className="absolute bottom-[4.8vh] w-full flex justify-center">
        <ChatInput />
      </div>
    </div>
  );
}
