'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useChatHistory } from '@/contexts/ChatHistoryContext';
import MessageSection from '@/components/sections/MessageSection';
import ChatInput from '@/components/ui/ChatInput';
import { aiChatFlow as jobFlow } from '@/data/ai-chat-job-list';
import { aiChatFlow as roadmapFlow } from '@/data/ai-chat-roadmap-list';
import { roadmapResults } from '@/data/ai-chat-roadmap-results';
import MessageItem from '@/components/ui/MessageItem';

export default function AiChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chapter = searchParams.get('chapter') || 'job'; // job 또는 roadmap
  const aiChatFlow = chapter === 'roadmap' ? roadmapFlow : jobFlow;

  const {
    messages,
    currentStep,
    isCompleted,
    addBotMessage,
    addUserMessage,
    nextStep,
    completeChat,
  } = useChatHistory();

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [showCurrentQuestion, setShowCurrentQuestion] = useState(false);

  // 초기 intro 메시지 추가
  useEffect(() => {
    if (messages.length === 0) {
      addBotMessage(aiChatFlow.intro.messages.join('\n'), 0);
      setShowCurrentQuestion(true);
    }
  }, [messages.length, aiChatFlow.intro.messages, addBotMessage]);

  // 현재 단계에 따른 질문 표시
  useEffect(() => {
    if (
      currentStep > 0 &&
      currentStep <= aiChatFlow.questions.length &&
      showCurrentQuestion
    ) {
      const currentQuestion = aiChatFlow.questions.find(
        (q) => q.step === currentStep
      );
      if (currentQuestion) {
        addBotMessage(currentQuestion.message.join('\n'), currentQuestion.id);
      }
      setShowCurrentQuestion(false);
    } else if (currentStep > aiChatFlow.questions.length && !isCompleted) {
      addBotMessage(aiChatFlow.outro.message.join('\n'));
      completeChat();
    }
  }, [
    currentStep,
    showCurrentQuestion,
    isCompleted,
    aiChatFlow,
    addBotMessage,
    completeChat,
  ]);

  const getCurrentQuestion = () => {
    if (currentStep === 0) return null;
    return aiChatFlow.questions.find((q) => q.step === currentStep);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleCompleteClick = () => {
    const currentQuestion = getCurrentQuestion();
    let userResponse = '';

    if (selectedOptions.length > 0) {
      userResponse = selectedOptions.join(', ');
    }

    if (textInput.trim()) {
      userResponse = userResponse ? `${userResponse}, ${textInput}` : textInput;
    }

    if (userResponse || selectedOptions.length > 0) {
      addUserMessage(userResponse, currentQuestion?.id, selectedOptions);
    }

    // 다음 단계로 이동
    if (currentStep < aiChatFlow.questions.length) {
      nextStep();
      setShowCurrentQuestion(true);
    } else {
      nextStep(); // 결과 페이지로 이동
    }

    // 상태 초기화
    setSelectedOptions([]);
    setTextInput('');
  };

  const handleSkipClick = () => {
    const currentQuestion = getCurrentQuestion();
    addUserMessage('건너뛰기', currentQuestion?.id);

    // 다음 단계로 이동
    if (currentStep < aiChatFlow.questions.length) {
      nextStep();
      setShowCurrentQuestion(true);
    } else {
      nextStep(); // 결과 페이지로 이동
    }

    // 상태 초기화
    setSelectedOptions([]);
    setTextInput('');
  };

  const handleStartClick = () => {
    addUserMessage('시작하기');
    nextStep(); // step 1로 이동
    setShowCurrentQuestion(true);
  };

  const currentQuestion = getCurrentQuestion();
  const showStartButton = currentStep === 0 && messages.length > 0;
  const showQuestionOptions =
    currentQuestion &&
    currentQuestion.options &&
    currentQuestion.options.length > 0;

  return (
    <div className="absolute top-[10vh] left-1/2 transform -translate-x-1/2">
      <MessageSection
        messages={messages}
        showStartButton={showStartButton}
        showQuestionOptions={showQuestionOptions || false}
        currentQuestionOptions={currentQuestion?.options || []}
        selectedOptions={selectedOptions}
        canSkip={currentQuestion?.canSkip || false}
        onStartClick={handleStartClick}
        onOptionClick={handleOptionClick}
        onCompleteClick={handleCompleteClick}
        onSkipClick={handleSkipClick}
      >
        {/* 완료된 경우 결과 표시 */}
        {isCompleted && (
          // 맞춤형 로드맵 부분
          <div className="ml-[3.7vw]">
            {chapter === 'roadmap' ? (
              <>
                <div className="space-y-2">
                  {roadmapResults.map((result, index) => (
                    <MessageItem
                      key={index}
                      message={result.message.join('\n')}
                      isBot={true}
                      hideProfile={true}
                      noTopMargin={true}
                    />
                  ))}
                </div>
                <div
                  className="flex items-center justify-center w-[20vh] h-[6.7vh] border-2 rounded-[12px] cursor-pointer text-chat-message bg-primary-90 text-white mt-4"
                  onClick={() => router.push('/career-roadmap')}
                >
                  로드맵으로 이동하기
                </div>
              </>
            ) : (
              // 맞춤형 직업 추천 부분
              <div className="text-center p-4">
                <p className="text-chat-message">결과가 준비되었습니다!</p>
              </div>
            )}
          </div>
        )}
      </MessageSection>

      {/* 입력창 */}
      <div className="absolute bottom-[4.8vh] w-full flex justify-center">
        <ChatInput
          value={textInput}
          onChange={setTextInput}
          onSend={handleCompleteClick}
        />
      </div>
    </div>
  );
}
