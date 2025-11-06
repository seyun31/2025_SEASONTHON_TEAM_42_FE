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
import RestartConfirmModal from '@/components/features/chat/RestartConfirmModal';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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
  const [historyChecked, setHistoryChecked] = useState(false);
  const [hasExistingConversation, setHasExistingConversation] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showMoreJobCardsButton, setShowMoreJobCardsButton] = useState(false);
  const [showReJobCardModal, setShowReJobCardModal] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [isWaitingForJobInput, setIsWaitingForJobInput] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

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
        // 이전 대화가 있는 경우 - 환영 메시지와 옵션 버튼 표시
        setHasExistingConversation(true);
        addBotMessage(
          `안녕하세요 ${userName} 반가워요 🙌\n다시 오셨네요! 무엇을 도와드릴까요?`
        );
        addComponentMessage('historyOptions', {});
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
  }, [userName, addBotMessage, addComponentMessage]);

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

  // AI 채팅 완료 후 직업 추천 가져오기
  const fetchJobRecommendations = useCallback(async () => {
    setIsLoadingRecommendations(true);
    setLoadingMessage(`${userName}을 위한 맞춤형 직업카드 생성중입니다!`);

    try {
      // 맞춤형 직업 추천 조회
      const recommendResponse = await fetch(
        '/api/chat/jobs/recommend/post-occupation',
        {
          method: 'POST',
        }
      );
      const recommendData = await recommendResponse.json();

      if (recommendData.result === 'SUCCESS') {
        setJobRecommendations(recommendData.data);
      } else {
        console.error('직업 추천 실패:', recommendData.error);
      }
    } catch (error) {
      console.error('직업 추천 가져오기 실패:', error);
    } finally {
      setIsLoadingRecommendations(false);
      setLoadingMessage('');
    }
  }, [userName]);

  // 강점 리포트 플로우 시작 (직업 입력 요청)
  const startStrengthReportFlow = useCallback(() => {
    // 강점 리포트 버튼 제거
    removeMessagesByType('strengthReportButton');

    // AI 메시지 추가
    addBotMessage(
      `이제 ${userName}만의 강점 리포트를 만들어볼게요! 📝\n이 리포트는 ${userName}이 가진 경험 속 강점을 한눈에 보여주고,\n나중에 기업에 제출할 때 '나를 소개하는 문서'로도 활용할 수 있어요 💪\n\n제2의 직업을 정하셨다면 '준비하는 직업'을 입력,\n아직 고민 중이라면 '없음'이라고 입력해주세요!`
    );

    // 직업 입력 대기 상태로 설정
    setIsWaitingForJobInput(true);
  }, [userName, addBotMessage, removeMessagesByType]);

  // 강점 리포트 생성 (API 호출)
  const generateStrengthReport = useCallback(async () => {
    try {
      // 로딩 메시지 설정
      setLoadingMessage(`${userName}을 위한 강점리포트를 생성중입니다!`);

      // 강점 리포트 조회
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
        setLoadingMessage('');

        // 강점 리포트 표시
        const expertType = generateExpertType(reports[0].strength);
        addBotMessage(
          `수고 많으셨어요 ${userName}! 🙏\n${userName}은 **${expertType}**입니다.`
        );

        // 강점 리포트 카드들 표시
        setTimeout(() => {
          reports.forEach((report: StrengthReport, index: number) => {
            setTimeout(() => {
              addComponentMessage('strengthReport', report);
            }, index * 100);
          });

          // 모든 리포트 카드가 표시된 후 페이지 이동 버튼 표시
          setTimeout(
            () => {
              addComponentMessage('strengthReportPageButton', {});
            },
            reports.length * 100 + 500
          );
        }, 500);
      } else {
        console.error('강점 리포트 조회 실패:', strengthData.error);
        setLoadingMessage('');
      }
    } catch (error) {
      console.error('강점 리포트 생성 실패:', error);
      setLoadingMessage('');
    }
  }, [userName, addBotMessage, addComponentMessage]);

  // 채팅 완료 시 직업 추천 가져오기
  useEffect(() => {
    if (isCompleted && !completionFlowStarted) {
      setCompletionFlowStarted(true);

      // 직업 추천 데이터 가져오기
      setTimeout(() => {
        fetchJobRecommendations();
      }, 1000);
    }
  }, [isCompleted, completionFlowStarted, fetchJobRecommendations]);

  // 직업 추천 데이터가 로드되면 메시지와 카드 표시
  useEffect(() => {
    if (jobRecommendations && !jobMessageAdded) {
      setJobMessageAdded(true);

      setTimeout(() => {
        addBotMessage(
          `${userName}님께 잘 어울리는 직업 3가지를 추천드릴게요!\n 마음에 드는 직업이 있다면 ⭐️ 아이콘을 눌러 관심목록에 저장해두세요.\n 나중에 다시 확인하실 때 훨씬 편해요 😀!`
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
    addBotMessage,
    addComponentMessage,
    setShowJobCards,
    strengthReports.length,
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
    // 직업 입력 대기 중인 경우
    if (isWaitingForJobInput && textInput.trim()) {
      addUserMessage(textInput.trim());
      setTextInput('');
      setIsWaitingForJobInput(false);
      setTimeout(() => generateStrengthReport(), 500);
      return;
    }

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

    if (currentStep < 10) {
      nextStep();
      setShowCurrentQuestion(true);
    } else {
      nextStep();
    }

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
    // 사용자 메시지 추가
    addUserMessage('시작하기');

    // step 1로 이동
    nextStep();
    setShowCurrentQuestion(true);
  };

  // 처음부터 다시 시작하기 버튼 클릭
  const handleRestartFromBeginning = () => {
    setShowRestartModal(true);
  };

  // 다시 시작 확인
  const handleRestartConfirm = async () => {
    setShowRestartModal(false);

    try {
      // API로 채팅 히스토리 초기화 요청
      await fetch('/api/chat/jobs/reset', {
        method: 'DELETE',
      });

      // 모든 상태 초기화
      resetChat();
      setSelectedOptions([]);
      setTextInput('');
      setJobRecommendations(null);
      setStrengthReports([]);
      setJobMessageAdded(false);
      setCompletionFlowStarted(false);
      setHasExistingConversation(false);
      setShowMoreJobCardsButton(false);

      // intro 메시지만 표시하고 대기
      setTimeout(() => {
        addBotMessage(aiChatFlow.intro.messages.join('\n'), 0);
        setShowCurrentQuestion(true);
      }, 100);
    } catch (error) {
      console.error('채팅 초기화 실패:', error);
    }
  };

  // 다시 시작 취소
  const handleRestartCancel = () => {
    setShowRestartModal(false);
  };

  // 지난 대화 내용 보기
  const handleViewHistory = () => {
    // historyOptions 컴포넌트 제거
    removeMessagesByType('historyOptions');

    // 이전 대화 내용 불러오기
    loadPreviousConversationHandler();
  };

  // 맞춤형 강점리포트 다시 받기 (historyOptions에서 호출)
  const handleGetStrengthReport = () => {
    // historyOptions 제거
    removeMessagesByType('historyOptions');

    // 직업 입력 버튼만 표시 (user 쪽)
    addComponentMessage('jobInputButton', {});
  };

  // 강점 리포트 페이지로 이동
  const handleNavigateToStrengthReport = () => {
    router.push('/strength-dashboard');
  };

  // 직업 입력 버튼 클릭 시
  const handleJobInputClick = () => {
    // jobInputButton 제거
    removeMessagesByType('jobInputButton');

    // 사용자 메시지 추가
    addUserMessage('준비 중인 직업 입력하고 강점리포트 받기');

    // AI 메시지 추가
    setTimeout(() => {
      addBotMessage(
        `이제 ${userName}만의 강점 리포트를 만들어볼게요! 📝\n이 리포트는 ${userName}이 가진 경험 속 강점을 한눈에 보여주고,\n나중에 기업에 제출할 때 '나를 소개하는 문서'로도 활용할 수 있어요 💪\n\n제2의 직업을 정하셨다면 '준비하는 직업'을 입력,\n아직 고민 중이라면 '없음'이라고 입력해주세요!`
      );

      // 직업 입력 대기 상태로 설정
      setIsWaitingForJobInput(true);
    }, 500);
  };

  const handleGetMoreJobCards = () => {
    setShowReJobCardModal(true);
  };

  const handleReJobCardConfirm = async () => {
    setShowReJobCardModal(false);

    try {
      // 로딩 메시지 설정
      setLoadingMessage(`${userName}을 위한 맞춤형 직업카드 생성중입니다!`);

      // 추가 직업 추천 API 호출
      const response = await fetch('/api/chat/jobs/recommend/post-occupation', {
        method: 'POST',
      });
      const data = await response.json();

      if (data.result === 'SUCCESS') {
        // 로딩 메시지 제거
        setLoadingMessage('');

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
        setLoadingMessage('');
        addBotMessage(
          '죄송합니다. 추가 직업 추천을 가져오는데 실패했습니다. 다시 시도해주세요.'
        );
      }
    } catch (error) {
      console.error('추가 직업 카드 요청 실패:', error);
      setLoadingMessage('');
      addBotMessage(
        '죄송합니다. 네트워크 오류가 발생했습니다. 다시 시도해주세요.'
      );
    }
  };

  const handleReJobCardCancel = () => {
    setShowReJobCardModal(false);
  };

  const currentQuestion = getCurrentQuestion();
  const showStartButton =
    currentStep === 0 && messages.length > 0 && !hasExistingConversation;

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

  // 로그아웃 상태 확인
  const isLoggedOut = !userData?.data;

  return (
    <>
      {/* 사용자 정보 로딩 오버레이 */}
      {userLoading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-lg z-40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/assets/Icons/character_running.webp"
              alt="loading"
              width={328}
              height={293}
              className="mb-16"
            />
            <p className="text-2xl md:text-3xl font-semibold text-gray-50">
              사용자 정보 불러오는중!
            </p>
          </div>
        </div>
      )}

      {/* 로그아웃 상태일 때 표시할 에러 컴포넌트 */}
      {isLoggedOut && !userLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/assets/logos/bad-gate-star.svg"
              alt="꿈별이 error 페이지 이미지"
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

      <div className="absolute top-[10vh] xs:top-[10vh] md:top-[10vh] lg:top-[10vh] left-1/2 transform -translate-x-1/2 max-w-[95vw] xs:max-w-[90vw] md:max-w-[800px] lg:max-w-[1200px] w-full px-2 xs:px-4 md:px-6 lg:px-0">
        <div className={isLoggedOut ? 'blur-sm pointer-events-none' : ''}>
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
            onRestartFromBeginning={handleRestartFromBeginning}
            onViewHistory={handleViewHistory}
            onGetStrengthReport={handleGetStrengthReport}
            onGenerateStrengthReport={startStrengthReportFlow}
            onJobInputClick={handleJobInputClick}
            onNavigateToStrengthReport={handleNavigateToStrengthReport}
            hasStrengthReports={strengthReports.length > 0}
          />

          {/* 진행바 및 입력창 컨테이너
        <div className="w-full max-w-[400px] xs:max-w-[1000px] md:max-w-[1000px] lg:max-w-[1200px] flex justify-center"> */}
          {/* 진행바 */}
          {currentStep > 0 && !isLoadingRecommendations && !isCompleted && (
            <div className="absolute bottom-[10vh] xs:bottom-[10vh] md:bottom-[13vh] lg:bottom-[14vh] left-1/2 transform -translate-x-1/2 w-full flex justify-center items-center animate-slide-up-fade">
              <ProgressBar currentStep={currentStep} totalSteps={10} />
            </div>
          )}
        </div>

        {/* 입력창 - 로그아웃 상태에서는 숨김 */}
        {!isLoggedOut && (
          <div className="absolute bottom-[3vh] md:bottom-[2vh] lg:bottom-[2.8vh] left-1/2 transform -translate-x-1/2 w-full max-w-[400px] xs:max-w-[1000px] md:max-w-[1000px] lg:max-w-[1200px] max-h-[15.5vh] xs:max-h-[15.5vh] md:max-h-[15vh] lg:max-h-[15.96vh] flex justify-center animate-slide-up-bounce">
            <ChatInput
              value={textInput}
              onChange={setTextInput}
              onSend={handleCompleteClick}
            />
          </div>
        )}
      </div>

      {/* 로딩 오버레이 */}
      {loadingMessage && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-lg z-40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/assets/Icons/character_cheer.png"
              alt="loading"
              width={235}
              height={304}
              className="mb-16"
            />
            <p className="text-2xl md:text-3xl font-semibold text-gray-50">
              {loadingMessage}
            </p>
          </div>
        </div>
      )}

      {/* ReJobCardModal */}
      {showReJobCardModal && (
        <ReJobCardModal
          onConfirm={handleReJobCardConfirm}
          onCancel={handleReJobCardCancel}
        />
      )}

      {/* RestartConfirmModal */}
      {showRestartModal && (
        <RestartConfirmModal
          onConfirm={handleRestartConfirm}
          onCancel={handleRestartCancel}
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
