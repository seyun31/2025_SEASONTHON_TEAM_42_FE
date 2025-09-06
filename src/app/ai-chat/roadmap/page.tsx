'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useChatHistory } from '@/contexts/ChatHistoryContext';
import MessageSection from '@/components/sections/MessageSection';
import ChatInput from '@/components/ui/ChatInput';
import { createAiChatRoadmapFlow } from '@/data/ai-chat-roadmap-list';
import MessageItem from '@/components/ui/MessageItem';
import { UserResponse } from '@/lib/types/user';

export default function AIChatRoadmap() {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // 사용자 정보 가져오기
  const { data: userData, isLoading: userLoading } = useQuery<UserResponse>({
    queryKey: ['user', 'profile'],
    queryFn: () => fetch('/api/auth/user').then((res) => res.json()),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 데이터가 5분동안 fresh상태로 유지
  });

  const userName = userData?.data?.name ? `${userData.data.name}님` : '님';
  const aiChatFlow = createAiChatRoadmapFlow(userName);

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
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [roadmapData, setRoadmapData] = useState<{
    steps: Array<{
      period: string;
      category: string;
      isCompleted: boolean;
      actions: Array<{
        action: string;
        isCompleted: boolean;
      }>;
    }>;
  } | null>(null);

  // 초기 intro 메시지 추가 (사용자 데이터 로딩 후)
  useEffect(() => {
    if (messages.length === 0 && !userLoading && userData) {
      addBotMessage(aiChatFlow.intro.messages.join('\n'), 0);
      setShowCurrentQuestion(true);
    }
  }, [
    messages.length,
    userLoading,
    userData,
    aiChatFlow.intro.messages,
    addBotMessage,
  ]);

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

  // 로드맵 추천 데이터 가져오기
  const fetchRoadmapRecommendations = useCallback(async () => {
    setIsLoadingRecommendations(true);

    try {
      // 세션 스토리지에서 사용자 답변 불러오기
      const storedAnswers = sessionStorage.getItem('roadmapAnswers');
      if (!storedAnswers) {
        console.error('저장된 로드맵 답변이 없습니다.');
        return;
      }

      const answers = JSON.parse(storedAnswers);

      // 액세스 토큰 가져오기
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
      };

      const accessToken = getCookie('accessToken');

      // 로드맵 추천 API 호출
      const response = await fetch(`${backendUrl}/job/recommend/roadmap`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          career: answers.career || '',
          experience: answers.experience || '',
          period: answers.period || '',
        }),
      });

      const data = await response.json();

      if (data.result === 'SUCCESS') {
        setRoadmapData(data.data);
      } else {
        console.error('로드맵 추천 실패:', data.error);
      }
    } catch (error) {
      console.error('로드맵 추천 데이터 가져오기 실패:', error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  }, [backendUrl]);

  // 채팅 완료 시 결과 데이터 가져오기
  useEffect(() => {
    if (isCompleted && !roadmapData) {
      fetchRoadmapRecommendations();
    }
  }, [isCompleted, roadmapData, fetchRoadmapRecommendations]);

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

  const handleCompleteClick = async () => {
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

      // 세션 스토리지에 답변 저장
      if (currentQuestion?.id && userResponse) {
        try {
          const existingAnswers = JSON.parse(
            sessionStorage.getItem('roadmapAnswers') ||
              '{"career":"","experience":"","period":""}'
          );

          // 질문 ID에 따라 적절한 필드에 저장
          switch (currentQuestion.id) {
            case 1:
              existingAnswers.career = userResponse;
              break;
            case 2:
              existingAnswers.experience = userResponse;
              break;
            case 3:
              existingAnswers.period = userResponse;
              break;
          }

          sessionStorage.setItem(
            'roadmapAnswers',
            JSON.stringify(existingAnswers)
          );
        } catch (error) {
          console.error('로드맵 답변 세션 저장 실패:', error);
        }
      }
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

  const handleSkipClick = async () => {
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

    // 로드맵 세션 스토리지 초기화
    sessionStorage.setItem(
      'roadmapAnswers',
      JSON.stringify({
        career: '',
        experience: '',
        period: '',
      })
    );

    nextStep(); // step 1로 이동
    setShowCurrentQuestion(true);
  };

  const currentQuestion = getCurrentQuestion();
  const showStartButton = currentStep === 0 && messages.length > 0;
  const currentOptions = currentQuestion?.options || [];
  const showQuestionOptions =
    currentQuestion && currentOptions && currentOptions.length > 0;

  // 로딩 상태 처리
  if (userLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="text-center">
          <p className="text-chat-message">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-[10vh] left-1/2 transform -translate-x-1/2">
      <MessageSection
        messages={messages}
        showStartButton={showStartButton}
        showQuestionOptions={showQuestionOptions || false}
        currentQuestionOptions={currentOptions}
        selectedOptions={selectedOptions}
        canSkip={currentQuestion?.canSkip || false}
        onStartClick={handleStartClick}
        onOptionClick={handleOptionClick}
        onCompleteClick={handleCompleteClick}
        onSkipClick={handleSkipClick}
      >
        {/* 완료된 경우 결과 표시 */}
        {isCompleted &&
          (isLoadingRecommendations ? (
            <div className="text-center p-4">
              <p className="text-chat-message">
                맞춤형 로드맵을 생성하는 중...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <MessageItem
                message="🎯 맞춤형 로드맵이 완성되었습니다!"
                isBot={true}
                hideProfile={true}
                noTopMargin={true}
              />

              {roadmapData &&
                roadmapData.steps &&
                roadmapData.steps.map((step, stepIndex: number) => (
                  <div
                    key={stepIndex}
                    className="bg-white rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg text-primary-90">
                        {step.period}
                      </h3>
                      <span className="px-3 py-1 bg-primary-10 text-primary-90 rounded-full text-sm">
                        {step.category}
                      </span>
                    </div>

                    {step.actions && step.actions.length > 0 && (
                      <div className="space-y-2">
                        {step.actions.map((action, actionIndex: number) => (
                          <div
                            key={actionIndex}
                            className="flex items-start space-x-2"
                          >
                            <div
                              className={`w-4 h-4 rounded-full border-2 mt-1 ${
                                action.isCompleted
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-300'
                              }`}
                            />
                            <p
                              className={`text-sm ${
                                action.isCompleted
                                  ? 'line-through text-gray-500'
                                  : 'text-gray-700'
                              }`}
                            >
                              {action.action}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

              <div
                className="flex items-center justify-center w-[20vh] h-[6.7vh] border-2 rounded-[12px] cursor-pointer text-chat-message bg-primary-90 text-white mt-4"
                onClick={() => router.push('/career-roadmap')}
              >
                로드맵으로 이동하기
              </div>
            </div>
          ))}
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
