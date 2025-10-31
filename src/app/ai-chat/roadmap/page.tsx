'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import {
  useChatHistory,
  ChatHistoryProvider,
} from '@/contexts/ChatHistoryContext';
import MessageSection from '@/components/features/chat/MessageSection';
import ChatInput from '@/components/ui/ChatInput';
import ProgressBar from '@/components/ui/ProgressBar';
import { createAiChatRoadmapFlow } from '@/data/ai-chat-roadmap-list';
import MessageItem from '@/components/ui/MessageItem';
import { UserResponse } from '@/types/user';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function AIChatRoadmapContent() {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // 사용자 정보 가져오기
  const { data: userData, isLoading: userLoading } = useQuery<UserResponse>({
    queryKey: ['user', 'profile'],
    queryFn: () => fetch('/api/auth/user').then((res) => res.json()),
    retry: 1,
    staleTime: 30 * 60 * 1000, // 데이터가 30분동안 fresh상태로 유지
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
      const response = await fetch(`${backendUrl}/roadmap/recommend`, {
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

  // 로그아웃 상태 확인
  const isLoggedOut = !userData?.data;

  return (
    <>
      {/* 로그아웃 상태일 때 표시할 에러 컴포넌트 */}
      {isLoggedOut && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/assets/logos/bad-gate-star.svg"
              alt="꿈별이 error페이지 이미지"
              width={375}
              height={316}
              className="max-w-full h-auto"
            />
            <div className="text-center">
              <h1 className="text-lg lg:text-2xl font-bold text-gray-50 mb-2">
                로그인 후 이용해보세요!
              </h1>
            </div>
          </div>
        </div>
      )}

      <div
        className={`absolute top-[10vh] xs:top-[10vh] md:top-[10vh] lg:top-[10vh] left-1/2 transform -translate-x-1/2 max-w-[95vw] xs:max-w-[90vw] md:max-w-[800px] lg:max-w-[1200px] w-full px-2 xs:px-4 md:px-6 lg:px-0 ${isLoggedOut ? 'blur-sm pointer-events-none' : ''}`}
      >
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
              <div className="text-center p-4 flex flex-col items-center gap-4">
                <DotLottieReact
                  src="https://lottie.host/b520eba8-53ae-4860-9a96-79419625c186/zQolKAd3tn.lottie"
                  loop
                  autoplay
                  style={{
                    width: '300px',
                    height: '300px',
                  }}
                />
              </div>
            ) : (
              <div className="ml-[0.5vw]">
                {roadmapData && roadmapData.steps && (
                  <MessageItem
                    message={`${userName}의 맞춤 커리어 로드맵이 완성되었습니다!\n\n${roadmapData.steps
                      .map(
                        (step) =>
                          `${step.period} - ${step.category}\n${step.actions
                            .map((action) => ` • ${action.action}`)
                            .join('\n')}`
                      )
                      .join(
                        '\n\n'
                      )}\n\n아래 버튼을 눌러 상세 로드맵을 확인하세요!`}
                    isBot={true}
                    hideProfile={true}
                    noTopMargin={true}
                  />
                )}

                <div className="flex items-start gap-[1.5vw] xs:gap-[1.5vw] md:gap-[0vw] lg:gap-[0vw] mt-2">
                  <div className="flex-shrink-0 w-[8vw] h-[6vh] xs:w-[6vw] xs:h-[5.5vh] md:w-[3.5vw] md:h-[5vh] lg:w-[2.71vw] lg:h-[4.81vh]" />
                  <div
                    className="flex items-center justify-center w-[22vh] max-w-[280px] h-[8vh] max-h-[55px] xs:w-[25vh] xs:max-w-[280px] xs:h-[5.5vh] xs:max-h-[50px] md:w-[18vh] md:max-w-[180px] md:h-[5.5vh] md:max-h-[50px] lg:w-[20vh] lg:max-w-[200px] lg:h-[6.7vh] lg:max-h-[60px] border-2 rounded-[12px] cursor-pointer text-chat-message bg-primary-90 text-white"
                    onClick={() => router.push('/career-roadmap')}
                  >
                    로드맵으로 이동하기
                  </div>
                </div>
              </div>
            ))}
        </MessageSection>

        {/* 진행바 */}
        {currentStep > 0 && !isLoadingRecommendations && !isCompleted && (
          <div className="absolute bottom-[10vh] xs:bottom-[10vh] md:bottom-[13vh] lg:bottom-[14vh] left-1/2 transform -translate-x-1/2 w-full flex justify-center items-center animate-slide-up-fade">
            <ProgressBar
              currentStep={currentStep}
              totalSteps={aiChatFlow.questions.length}
            />
          </div>
        )}

        {/* 입력창 */}
        <div className="absolute bottom-[3vh] md:bottom-[2vh] lg:bottom-[2.8vh] left-1/2 transform -translate-x-1/2 w-full max-w-[400px] xs:max-w-[1000px] md:max-w-[1000px] lg:max-w-[1200px] max-h-[12.5vh] xs:max-h-[12.5vh] md:max-h-[15vh] lg:max-h-[15.96vh] flex justify-center animate-slide-up-bounce">
          <ChatInput
            value={textInput}
            onChange={setTextInput}
            onSend={handleCompleteClick}
          />
        </div>
      </div>
    </>
  );
}

export default function AIChatRoadmap() {
  return (
    <ChatHistoryProvider>
      <AIChatRoadmapContent />
    </ChatHistoryProvider>
  );
}
