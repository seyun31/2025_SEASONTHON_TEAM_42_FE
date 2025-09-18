'use client';

import { useEffect, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import {
  useChatHistory,
  ChatHistoryProvider,
} from '@/contexts/ChatHistoryContext';
import MessageSection from '@/components/features/chat/MessageSection';
import ChatInput from '@/components/ui/ChatInput';
import ProgressBar from '@/components/ui/ProgressBar';
import { createAiChatFlow } from '@/data/ai-chat-job-list';
import { UserResponse } from '@/types/user';
import { generateExpertType } from '@/utils/expertTypeGenerator';
import {
  loadPreviousConversation,
  checkChatHistory as checkChatHistoryUtil,
} from '@/utils/chatHistory';
import ReJobCardModal from '@/components/features/chat/ReJobCardModal';

interface Occupation {
  imageUrl: string;
  occupationName: string;
  description: string;
  strength: string;
  workCondition: string;
  wish: string;
  score: string;
}

interface JobRecommendations {
  first: Occupation;
  second: Occupation;
  third: Occupation;
}

interface StrengthReport {
  strength: string;
  experience: string;
  keyword: string[];
  job: string[];
}

interface ApiStrengthReport {
  strength: string;
  experience: string;
  keyword: string[];
  job: string[];
}

function AIChatJobContent() {
  // 사용자 정보 가져오기
  const { data: userData, isLoading: userLoading } = useQuery<UserResponse>({
    queryKey: ['user', 'profile'],
    queryFn: () => fetch('/api/auth/user').then((res) => res.json()),
    retry: 1,
    staleTime: 30 * 60 * 1000, // 데이터가 30분동안 fresh상태로 유지
  });

  const userName = userData?.data?.name ? `${userData.data.name}님` : '님';

  const aiChatFlow = createAiChatFlow(userName);

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
  const [dynamicOptions, setDynamicOptions] = useState<string[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [optionsFetched, setOptionsFetched] = useState<Set<number>>(new Set());
  const [jobRecommendations, setJobRecommendations] =
    useState<JobRecommendations | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [, setShowJobCards] = useState(false);
  const [completionFlowStarted, setCompletionFlowStarted] = useState(false);
  const [jobMessageAdded, setJobMessageAdded] = useState(false);
  const [strengthReports, setStrengthReports] = useState<StrengthReport[]>([]);
  const [strengthReportAdded, setStrengthReportAdded] = useState(false);
  const [historyChecked, setHistoryChecked] = useState(false);
  const [hasExistingConversation, setHasExistingConversation] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showMoreJobCardsButton, setShowMoreJobCardsButton] = useState(false);
  const [showReJobCardModal, setShowReJobCardModal] = useState(false);

  // 이전 대화 기록 불러오기 함수
  const loadPreviousConversationHandler = useCallback(async () => {
    if (isLoadingHistory) return; // 이미 로딩 중이면 중복 호출 방지
    setIsLoadingHistory(true);

    try {
      await loadPreviousConversation({
        userName,
        aiChatFlow,
        strengthReports,
        jobRecommendations,
        addBotMessage,
        addUserMessage,
        addComponentMessage,
        setStrengthReports,
        setJobRecommendations,
        setJobMessageAdded,
        setStrengthReportAdded,
        setShowJobCards,
      });
    } finally {
      setIsLoadingHistory(false);
    }
  }, [
    userName,
    aiChatFlow,
    strengthReports,
    jobRecommendations,
    addBotMessage,
    addUserMessage,
    addComponentMessage,
    isLoadingHistory,
  ]);

  // 채팅 히스토리 확인 함수
  const checkChatHistoryHandler = useCallback(async () => {
    try {
      const hasHistory = await checkChatHistoryUtil();

      if (hasHistory) {
        // 이전 대화가 있는 경우 - 기존 대화 데이터 모두 불러와서 표시
        setHasExistingConversation(true);
        loadPreviousConversationHandler();
      } else {
        // job이 null이거나 빈 문자열이면 처음부터 시작 (기존 로직)
        setHasExistingConversation(false);
      }
    } catch (error) {
      console.warn('채팅 히스토리 확인 실패:', error);
      // 에러 발생 시 처음부터 시작
      setHasExistingConversation(false);
    } finally {
      setHistoryChecked(true);
    }
  }, [loadPreviousConversationHandler]);

  // 페이지 로드 시 채팅 히스토리 확인
  useEffect(() => {
    if (!userLoading && userData && !historyChecked) {
      checkChatHistoryHandler();
    }
  }, [userLoading, userData, historyChecked, checkChatHistoryHandler]);

  // 초기 intro 메시지 표시 (이전 대화가 없는 경우에만)
  useEffect(() => {
    if (
      messages.length === 0 &&
      !userLoading &&
      userData &&
      historyChecked &&
      !hasExistingConversation
    ) {
      addBotMessage(aiChatFlow.intro.messages.join('\n'), 0);
      setShowCurrentQuestion(true);
    }
  }, [
    messages.length,
    userLoading,
    userData,
    historyChecked,
    hasExistingConversation,
    aiChatFlow.intro.messages,
    addBotMessage,
  ]);

  // 현재 단계에 따른 질문 표시
  useEffect(() => {
    if (currentStep > 0 && currentStep <= 10 && showCurrentQuestion) {
      const currentQuestion = aiChatFlow.questions.find(
        (q) => q.step === currentStep
      );

      if (currentQuestion) {
        addBotMessage(currentQuestion.message.join('\n'), currentQuestion.id);
      }
      setShowCurrentQuestion(false);
    } else if (currentStep > 10 && !isCompleted) {
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

  // choice나 mixed 타입 질문에서 동적 옵션 조회
  useEffect(() => {
    const currentQuestion = aiChatFlow.questions.find(
      (q) => q.step === currentStep
    );

    if (
      currentQuestion &&
      currentQuestion.step <= 7 &&
      (currentQuestion.type === 'choice' || currentQuestion.type === 'mixed') &&
      !optionsFetched.has(currentQuestion.step) &&
      !isLoadingOptions
    ) {
      const fetchOptions = async () => {
        setIsLoadingOptions(true);

        try {
          const response = await fetch(
            `/api/chat/jobs/options/${currentQuestion.step}`
          );
          const data = await response.json();

          if (data.result === 'SUCCESS' && data.data?.optionList) {
            setDynamicOptions(data.data.optionList);
          } else {
            setDynamicOptions([]);
          }
        } catch (error) {
          console.error('옵션 조회 실패:', error);
          setDynamicOptions([]);
        } finally {
          setIsLoadingOptions(false);
          setOptionsFetched((prev) => new Set(prev.add(currentQuestion.step)));
        }
      };

      fetchOptions();
    }
  }, [currentStep, aiChatFlow.questions, optionsFetched, isLoadingOptions]);

  // AI 채팅 완료 후 결과 데이터 가져오기
  const fetchJobRecommendations = useCallback(async () => {
    setIsLoadingRecommendations(true);

    try {
      // 1. 강점 리포트 조회
      const strengthResponse = await fetch('/api/chat/strength/result', {
        method: 'POST',
      });
      const strengthData = await strengthResponse.json();

      if (
        strengthData.result === 'SUCCESS' &&
        strengthData.data?.reportList?.length > 0
      ) {
        const reports = strengthData.data.reportList.map(
          (report: ApiStrengthReport) => ({
            strength: report.strength.replace(/입니다\.$/, ''),
            experience: report.experience,
            keyword: report.keyword,
            job: report.job,
          })
        );

        setStrengthReports(reports);

        // 로딩 메시지 제거
        removeMessagesByType('loading');

        // 강점 리포트 표시
        const expertType = generateExpertType(reports[0].strength);
        addBotMessage(
          `수고 많으셨어요 ${userName}! 🙏\n${userName}은 **${expertType}**입니다.`
        );
      } else {
        console.error('강점 리포트 조회 실패:', strengthData.error);
        removeMessagesByType('loading');
      }

      // 3. 직업 추천 로딩 메시지 표시
      addComponentMessage('loading', {
        loadingType: 'jobRecommendation',
      });

      // 잠시 대기 후 맞춤형 직업 추천 조회
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const recommendResponse = await fetch(
        '/api/chat/jobs/recommend/occupation'
      );
      const recommendData = await recommendResponse.json();

      if (recommendData.result === 'SUCCESS') {
        setJobRecommendations(recommendData.data);
      } else {
        console.error('직업 추천 실패:', recommendData.error);
      }
    } catch (error) {
      console.error('결과 데이터 가져오기 실패:', error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  }, [userName, addBotMessage, removeMessagesByType, addComponentMessage]);

  // 채팅 완료 시 결과 데이터 가져오기
  useEffect(() => {
    if (isCompleted && !completionFlowStarted) {
      setCompletionFlowStarted(true);

      // 1단계: 강점 리포트 생성 중 로딩
      setTimeout(() => {
        addComponentMessage('loading', { loadingType: 'strengthReport' });

        // 2단계: 강점 리포트 데이터 가져오기
        setTimeout(() => {
          fetchJobRecommendations();
        }, 1000);
      }, 1000);
    }
  }, [isCompleted, completionFlowStarted]); // eslint-disable-line react-hooks/exhaustive-deps

  // 직업 추천 데이터가 로드되면 메시지와 카드 표시
  useEffect(() => {
    if (jobRecommendations && !jobMessageAdded) {
      setJobMessageAdded(true);

      // 로딩 메시지 제거
      removeMessagesByType('loading');

      setTimeout(() => {
        addBotMessage(
          '이 강점을 살려 추천드리는 직업 TOP 3입니다.\n"⭐"아이콘을 눌러 관심목록에 저장하고, 뒷면도 확인해보세요!'
        );

        setTimeout(() => {
          addComponentMessage('jobCards', jobRecommendations);
          setShowJobCards(true);
          // 새로 생성된 직업 카드에만 버튼 표시
          setShowMoreJobCardsButton(true);
        }, 1500);
      }, 500);
    }
  }, [
    jobRecommendations,
    jobMessageAdded,
    removeMessagesByType,
    addBotMessage,
    addComponentMessage,
    setShowJobCards,
  ]);

  useEffect(() => {
    if (
      strengthReports.length > 0 &&
      !strengthReportAdded &&
      !hasExistingConversation
    ) {
      setStrengthReportAdded(true);

      removeMessagesByType('loading');

      setTimeout(() => {
        strengthReports.forEach((report, index) => {
          setTimeout(() => {
            addComponentMessage('strengthReport', report);
          }, index);
        });
      }, 500);
    }
  }, [
    strengthReports,
    strengthReportAdded,
    hasExistingConversation,
    removeMessagesByType,
    addComponentMessage,
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

      // API로 답변 저장
      if (currentQuestion?.id) {
        try {
          await fetch('/api/chat/jobs/save/answer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sequence: currentQuestion.id,
              answer: userResponse,
            }),
          });
        } catch (error) {
          console.error('답변 저장 실패:', error);
        }
      }
    }

    // 다음 단계로 이동 (10개 질문 모두 처리)
    if (currentStep < 10) {
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

    // API로 빈 답변 저장
    if (currentQuestion?.id) {
      try {
        await fetch('/api/chat/jobs/save/answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sequence: currentQuestion.id,
            answer: '',
          }),
        });
      } catch (error) {
        console.error('건너뛰기 답변 저장 실패:', error);
      }
    }

    // 다음 단계로 이동 (10개 질문 모두 처리)
    if (currentStep < 10) {
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
    // 새로운 대화 시작을 위해 기존 메시지 초기화
    resetChat();

    // 상태 초기화
    setSelectedOptions([]);
    setTextInput('');
    setJobRecommendations(null);
    setStrengthReports([]);
    setJobMessageAdded(false);
    setStrengthReportAdded(false);
    setCompletionFlowStarted(false);
    setHasExistingConversation(false); // 새로운 대화로 간주
    setShowMoreJobCardsButton(false); // 버튼 상태 초기화

    // intro 메시지부터 시작
    setTimeout(() => {
      addBotMessage(aiChatFlow.intro.messages.join('\n'), 0);
      addUserMessage('시작하기');
      nextStep(); // step 1로 이동
      setShowCurrentQuestion(true);
    }, 100);
  };

  const handleGetMoreJobCards = () => {
    setShowReJobCardModal(true);
  };

  const handleReJobCardConfirm = async () => {
    setShowReJobCardModal(false);

    try {
      // 로딩 메시지 표시
      addComponentMessage('loading', {
        loadingType: 'jobRecommendation',
      });

      // 추가 직업 추천 API 호출
      const response = await fetch('/api/chat/jobs/recommend/occupation');
      const data = await response.json();

      if (data.result === 'SUCCESS') {
        // 로딩 메시지 제거
        removeMessagesByType('loading');

        // 기존 직업 카드를 제거하고 새로운 카드로 교체
        removeMessagesByType('jobCards');

        // 새로운 직업 카드 데이터로 업데이트
        setJobRecommendations(data.data);

        // 잠시 후 업데이트된 카드 표시
        setTimeout(() => {
          addBotMessage('새로운 추천 직업 Top3입니다. 뒷면도 확인해보세요!');

          setTimeout(() => {
            addComponentMessage('jobCards', data.data);
          }, 300);
        }, 500);
      } else {
        removeMessagesByType('loading');
        addBotMessage(
          '죄송합니다. 추가 직업 추천을 가져오는데 실패했습니다. 다시 시도해주세요.'
        );
      }
    } catch (error) {
      console.error('추가 직업 카드 요청 실패:', error);
      removeMessagesByType('loading');
      addBotMessage(
        '죄송합니다. 네트워크 오류가 발생했습니다. 다시 시도해주세요.'
      );
    }
  };

  const handleReJobCardCancel = () => {
    setShowReJobCardModal(false);
  };

  const currentQuestion = getCurrentQuestion();
  const showStartButton = currentStep === 0 && messages.length > 0;

  // 동적 옵션이 있는 경우 사용, 없으면 기본 옵션 사용
  const currentOptions = (() => {
    if (!currentQuestion) return [];

    const isChoiceOrMixed =
      currentQuestion.type === 'choice' || currentQuestion.type === 'mixed';

    if (isChoiceOrMixed) {
      // step 8부터는 기본 옵션 사용
      if (currentQuestion.step >= 8) {
        return currentQuestion.options || [];
      }

      // step 7까지는 동적 옵션 사용
      if (isLoadingOptions) {
        return currentQuestion.options || [];
      }
      if (dynamicOptions.length > 0) {
        return dynamicOptions;
      }
    }

    return currentQuestion.options || [];
  })();

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
          onGetMoreJobCards={handleGetMoreJobCards}
          showMoreJobCardsButton={showMoreJobCardsButton}
        />

        {/* 진행바 및 입력창 컨테이너
      <div className="w-full max-w-[400px] xs:max-w-[1000px] md:max-w-[1000px] lg:max-w-[1200px] flex justify-center"> */}
        {/* 진행바 */}
        {currentStep > 0 && !isLoadingRecommendations && !isCompleted && (
          <div className="absolute bottom-[10vh] xs:bottom-[10vh] md:bottom-[13vh] lg:bottom-[14vh] left-1/2 transform -translate-x-1/2 w-full flex justify-center items-center animate-slide-up-fade">
            <ProgressBar currentStep={currentStep} totalSteps={10} />
          </div>
        )}

        {/* 입력창 */}
        <div className="absolute bottom-[3vh] md:bottom-[2vh] lg:bottom-[2.8vh] left-1/2 transform -translate-x-1/2 w-full max-w-[400px] xs:max-w-[1000px] md:max-w-[1000px] lg:max-w-[1200px] max-h-[15.5vh] xs:max-h-[15.5vh] md:max-h-[15vh] lg:max-h-[15.96vh] flex justify-center animate-slide-up-bounce">
          <ChatInput
            value={textInput}
            onChange={setTextInput}
            onSend={handleCompleteClick}
          />
        </div>
      </div>

      {/* ReJobCardModal */}
      {showReJobCardModal && (
        <ReJobCardModal
          onConfirm={handleReJobCardConfirm}
          onCancel={handleReJobCardCancel}
        />
      )}
    </>
  );
}

export default function AIChatJob() {
  return (
    <ChatHistoryProvider>
      <AIChatJobContent />
    </ChatHistoryProvider>
  );
}
