'use client';

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import MessageItem from '@/components/ui/MessageItem';
import MessageOptionItem from '@/components/ui/MessageOptionItem';
import { aiChatFlow } from '@/data/ai-chat-list';
import ChatInput from '@/components/ui/ChatInput';

export default function AiChatQuestions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = parseInt(searchParams.get('step') || '1');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');

  // step이 변경될 때 입력창의 입력값 초기화
  useEffect(() => {
    setTextInput('');
    setSelectedOptions([]);
  }, [step]);

  // 현재 질문 데이터
  const currentQuestion = aiChatFlow.questions.find((q) => q.step === step);
  if (!currentQuestion) {
    return <div>질문을 찾을 수 없습니다.</div>;
  }

  const handleOptionClick = (option: string) => {
    console.log(`옵션 선택: ${option}`);
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  // 답변 저장 로직
  const handleCompleteClick = () => {
    console.log('선택된 옵션:', selectedOptions);
    console.log('텍스트 입력:', textInput);

    // 다음 질문 또는 결과 페이지로 이동
    if (step < aiChatFlow.questions.length) {
      router.push(`/ai-chat/questions?step=${step + 1}`);
    } else {
      router.push('/ai-chat/result');
    }
  };

  // 건너뛰기 로직
  const handleSkipClick = () => {
    console.log('건너뛰기');

    // 다음 질문 페이지로 이동
    if (step < aiChatFlow.questions.length) {
      router.push(`/ai-chat/questions?step=${step + 1}`);
    }
  };

  return (
    <div className="w-[53vw] h-[69.81vh] overflow-y-auto scrollbar-hide mx-auto mt-[0.3vh] mb-[20vh] flex flex-col gap-4 px-4">
      {/* 질문 메시지 */}
      <div className="flex justify-start">
        <MessageItem
          message={currentQuestion.message.join('\n')}
          isBot={true}
        />
      </div>

      {/* 선택지가 있는 경우 */}
      {currentQuestion.options && currentQuestion.options.length > 0 && (
        <div className="flex justify-end">
          <MessageOptionItem
            options={currentQuestion.options}
            onOptionClick={handleOptionClick}
            onCompleteClick={handleCompleteClick}
            onSkipClick={currentQuestion.canSkip ? handleSkipClick : undefined}
            placeholder="선택완료"
          />
        </div>
      )}

      {/* 입력창 */}
      <div className="absolute bottom-[4.8vh] w-full flex">
        <ChatInput
          value={textInput}
          onChange={setTextInput}
          onSend={handleCompleteClick}
        />
      </div>
    </div>
  );
}
