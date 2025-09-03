import ChatInput from '@/components/ui/ChatInput';

export default function AiChat() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1">
        <div>Ai 채팅 페이지</div>
      </div>
      <div className="pb-[4.5vh] flex justify-center">
        <ChatInput />
      </div>
    </div>
  );
}
