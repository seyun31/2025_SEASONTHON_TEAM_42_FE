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
import { api } from '@/lib/api/axios';
import RestartConfirmModal from '@/components/features/chat/RestartConfirmModal';
import { AxiosError } from 'axios';

interface RoadmapStep {
  period: string;
  category: string;
  isCompleted: boolean;
  actions: Array<{
    action: string;
    isCompleted: boolean;
  }>;
}

interface RoadmapResponse {
  result: string;
  data: {
    steps: RoadmapStep[];
  };
  error?: {
    code: string;
    message: string;
  };
}

interface CertificationResponse {
  result: string;
  data: {
    certificationList: string[];
  };
  error?: {
    code: string;
    message: string;
  };
}

function AIChatRoadmapContent() {
  const router = useRouter();

  // 사용자 정보 가져오기
  const { data: userData, isLoading: userLoading } = useQuery<UserResponse>({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const { data } = await api.get<UserResponse>('/api/auth/user');
      return data;
    },
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
    addComponentMessage,
    removeMessagesByType,
    nextStep,
    completeChat,
    resetChat,
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
  const [hasExistingRoadmap, setHasExistingRoadmap] = useState<boolean>(false);
  const [roadmapChecked, setRoadmapChecked] = useState<boolean>(false);
  const [showRestartModal, setShowRestartModal] = useState<boolean>(false);
  const [dynamicOptions, setDynamicOptions] = useState<string[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [firstQuestionAnswer, setFirstQuestionAnswer] = useState<string>('');
  const [optionsFetched, setOptionsFetched] = useState(false);

  // 기존 로드맵 확인 함수
  const checkExistingRoadmapHandler = useCallback(async () => {
    try {
      const { data } = await api.get<RoadmapResponse>('/api/roadmap/recommend');

      if (data.result === 'SUCCESS' && data.data?.steps?.length > 0) {
        // 기존 로드맵이 있는 경우 - 환영 메시지와 버튼 표시
        setHasExistingRoadmap(true);

        // 기존 newRoadmapButton 메시지 모두 제거 (중복 방지)
        removeMessagesByType('newRoadmapButton');

        addBotMessage(
          `안녕하세요 ${userName} 반가워요 🙌\n다시 오셨네요!\n무엇을 도와드릴까요?`,
          0
        );
        // 커리어 로드맵 새로 받기 버튼 추가 (AI side만)
        addComponentMessage('newRoadmapButton', { isUserSide: false });
      } else {
        // 기존 로드맵이 없는 경우
        setHasExistingRoadmap(false);
      }
    } catch (error) {
      setHasExistingRoadmap(false);
    } finally {
      setRoadmapChecked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  // 페이지 로드 시 기존 로드맵 확인
  useEffect(() => {
    if (!userLoading && userData && !roadmapChecked) {
      checkExistingRoadmapHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoading, userData, roadmapChecked]);

  // 초기 intro 메시지 표시 (기존 로드맵이 없는 경우에만)
  useEffect(() => {
    if (
      messages.length === 0 &&
      !userLoading &&
      userData &&
      roadmapChecked &&
      !hasExistingRoadmap
    ) {
      addBotMessage(aiChatFlow.intro.messages.join('\n'), 0);
      setShowCurrentQuestion(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    messages.length,
    userLoading,
    userData,
    roadmapChecked,
    hasExistingRoadmap,
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

      // 로드맵 생성 API 호출
      const { data } = await api.post<RoadmapResponse>(
        '/api/roadmap/recommend',
        {
          career: answers.career || '',
          experience: answers.experience || '',
          period: answers.period || '',
        }
      );

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
  }, []);

  // 채팅 완료 시 결과 데이터 가져오기
  useEffect(() => {
    if (isCompleted && !roadmapData) {
      fetchRoadmapRecommendations();
    }
  }, [isCompleted, roadmapData, fetchRoadmapRecommendations]);

  // 2번째 질문 (step 2)에서 자격증 옵션 조회
  useEffect(() => {
    const currentQuestion = aiChatFlow.questions.find(
      (q) => q.step === currentStep
    );

    if (
      currentQuestion &&
      currentQuestion.step === 2 &&
      firstQuestionAnswer &&
      !isLoadingOptions &&
      !optionsFetched
    ) {
      const fetchCertificationOptions = async () => {
        setIsLoadingOptions(true);

        try {
          console.log('[Roadmap] 자격증 옵션 조회 시작:', {
            occupation: firstQuestionAnswer,
          });

          const { data } = await api.post<CertificationResponse>(
            '/api/roadmap/certification',
            {
              occupation: firstQuestionAnswer,
            }
          );

          if (data.result === 'SUCCESS' && data.data?.certificationList) {
            setDynamicOptions(data.data.certificationList);
          } else {
            setDynamicOptions([]);
          }
        } catch (error) {
          console.error('[Roadmap] 자격증 옵션 조회 실패:', error);
          if (error instanceof AxiosError) {
            console.error('[Roadmap] Axios 에러 상세:', error.response?.data);
          }
          // 에러 시 빈 배열 유지 (text input 사용)
          setDynamicOptions([]);
        } finally {
          setIsLoadingOptions(false);
          setOptionsFetched(true);
        }
      };

      fetchCertificationOptions();
    }
  }, [
    currentStep,
    aiChatFlow.questions,
    firstQuestionAnswer,
    isLoadingOptions,
    optionsFetched,
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

      // 첫 번째 질문의 답변 저장 (occupation)
      if (currentQuestion?.id === 1 && userResponse) {
        setFirstQuestionAnswer(userResponse);
      }

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

    // 2번 질문으로 넘어갈 때 동적 옵션 초기화
    if (currentQuestion?.id === 1) {
      setDynamicOptions([]);
      setOptionsFetched(false);
    }
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
    // 기존 로드맵이 없으면 바로 시작
    startNewRoadmap();
  };

  const handleNewRoadmapButtonClick = () => {
    // AI 쪽 버튼 클릭 -> 사용자 쪽에 보라색 버튼 추가
    addComponentMessage('newRoadmapButton', { isUserSide: true });
  };

  const handleUserRoadmapButtonClick = () => {
    // 사용자 쪽 버튼 클릭 -> 모달 표시
    setShowRestartModal(true);
  };

  const startNewRoadmap = () => {
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

  const handleRestartConfirm = () => {
    setShowRestartModal(false);

    // 상태 초기화
    resetChat();
    setSelectedOptions([]);
    setTextInput('');
    setRoadmapData(null);
    setHasExistingRoadmap(false);
    setDynamicOptions([]);
    setFirstQuestionAnswer('');
    setOptionsFetched(false);

    // 세션 스토리지 초기화
    sessionStorage.setItem(
      'roadmapAnswers',
      JSON.stringify({
        career: '',
        experience: '',
        period: '',
      })
    );

    // 대화 시작
    setTimeout(() => {
      addBotMessage(aiChatFlow.intro.messages.join('\n'), 0);
      setShowCurrentQuestion(true);
    }, 100);
  };

  const handleRestartCancel = () => {
    setShowRestartModal(false);
  };

  const currentQuestion = getCurrentQuestion();
  const showStartButton =
    currentStep === 0 && messages.length > 0 && !hasExistingRoadmap;
  const startButtonText = '시작하기';

  // 2번 질문이면 동적 옵션 사용, 아니면 기본 옵션 사용
  const currentOptions =
    currentQuestion?.step === 2 && dynamicOptions.length > 0
      ? dynamicOptions
      : currentQuestion?.options || [];

  const showQuestionOptions =
    currentQuestion && currentOptions && currentOptions.length > 0;

  // 로딩 상태 처리
  if (userLoading) {
    return (
      <div className="fixed inset-0 bg-white/60 backdrop-blur-lg z-40 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/assets/Icons/character_running.webp"
            alt="loading"
            width={235}
            height={304}
            className="mb-8 md:mb-16 w-[200px] h-auto md:w-[328px]"
          />
          <p className="text-2xl md:text-3xl font-semibold text-gray-50">
            로드맵 채팅 정보 불러오는중
          </p>
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
          startButtonText={startButtonText}
          showQuestionOptions={showQuestionOptions || false}
          currentQuestionOptions={currentOptions}
          selectedOptions={selectedOptions}
          canSkip={currentQuestion?.canSkip || false}
          onStartClick={handleStartClick}
          onOptionClick={handleOptionClick}
          onCompleteClick={handleCompleteClick}
          onSkipClick={handleSkipClick}
          onNewRoadmapButtonClick={handleNewRoadmapButtonClick}
          onUserRoadmapButtonClick={handleUserRoadmapButtonClick}
        >
          {/* 완료된 경우 결과 표시 */}
          {isCompleted &&
            (isLoadingRecommendations ? (
              <div className="fixed inset-0 bg-white/60 backdrop-blur-lg z-40 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <Image
                    src="/assets/Icons/character_cheer.png"
                    alt="loading"
                    width={235}
                    height={304}
                    className="mb-8 md:mb-16 w-[200px] h-auto md:w-[328px]"
                  />
                  <p className="text-2xl md:text-3xl font-semibold text-gray-50">
                    로드맵 생성중
                  </p>
                </div>
              </div>
            ) : (
              <div>
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

                <div className="flex justify-start ml-12 xs:ml-11 md:ml-10 lg:ml-[52px] mt-2">
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

      {/* 로드맵 재생성 확인 모달 */}
      {showRestartModal && (
        <RestartConfirmModal
          onConfirm={handleRestartConfirm}
          onCancel={handleRestartCancel}
          message={
            <>
              <div>커리어 로드맵을 새로 받으면</div>
              <div className="text-primary-90">
                기존 커리어 로드맵은 모두 지워져요.
              </div>
              <div>새로 받을까요?</div>
            </>
          }
          confirmText="새로 받기"
        />
      )}
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
