import ChatInput from '@/components/ui/ChatInput';
import MessageSection from '@/components/sections/MessageSection';

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
