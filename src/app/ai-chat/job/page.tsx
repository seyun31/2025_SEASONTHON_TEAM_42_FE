'use client';

import { useEffect, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useChatHistory } from '@/contexts/ChatHistoryContext';
import MessageSection from '@/components/sections/MessageSection';
import ChatInput from '@/components/ui/ChatInput';
import { createAiChatFlow } from '@/data/ai-chat-job-list';
import MessageItem from '@/components/ui/MessageItem';
import FlipCard from '@/components/card-component/AIChatJobCard';
import { UserResponse } from '@/lib/types/user';

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

export default function AIChatJob() {
  // 사용자 정보 가져오기
  const { data: userData, isLoading: userLoading } = useQuery<UserResponse>({
    queryKey: ['user', 'profile'],
    queryFn: () => fetch('/api/auth/user').then((res) => res.json()),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 데이터가 5분동안 fresh상태로 유지
  });

  const userName = userData?.data?.name ? `${userData.data.name}님` : '님';
  const aiChatFlow = createAiChatFlow(userName);

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
  const [dynamicOptions, setDynamicOptions] = useState<string[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [optionsFetched, setOptionsFetched] = useState<Set<number>>(new Set());
  const [jobRecommendations, setJobRecommendations] =
    useState<JobRecommendations | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);

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
      // 1. 채팅 히스토리 조회
      await fetch('/api/chat/jobs/history');

      // 2. 맞춤형 직업 추천 조회
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
  }, []);

  // 채팅 완료 시 결과 데이터 가져오기
  useEffect(() => {
    if (isCompleted && !jobRecommendations) {
      fetchJobRecommendations();
    }
  }, [isCompleted, jobRecommendations, fetchJobRecommendations]);

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
          await fetch('/api/chat/jobs/save', {
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

    // API로 빈 답변 저장
    if (currentQuestion?.id) {
      try {
        await fetch('/api/chat/jobs/save', {
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

  return (
    <div className="absolute top-[10vh] left-1/2 transform -translate-x-1/2 max-w-[1200px] w-full">
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
        {isCompleted && (
          <div className="space-y-4">
            {isLoadingRecommendations ? (
              <div className="text-center p-4">
                <p className="text-chat-message">
                  맞춤형 직업을 추천하는 중...
                </p>
              </div>
            ) : jobRecommendations ? (
              <div className="ml-[0.5vw]">
                <MessageItem
                  message={`${userName}의 추천 직업카드 3개에요! 별 아이콘을 눌러 관심목록에 저장하세요!`}
                  isBot={true}
                  hideProfile={true}
                  noTopMargin={true}
                />

                <div className="flex gap-4 w-full mt-4">
                  {[
                    jobRecommendations.first,
                    jobRecommendations.second,
                    jobRecommendations.third,
                  ].map((occupation, index) => (
                    <FlipCard
                      key={index}
                      imageUrl={occupation.imageUrl}
                      jobTitle={occupation.occupationName}
                      jobDescription={occupation.description}
                      recommendationScore={parseInt(occupation.score) || 0}
                      strengths={{
                        title: occupation.strength,
                        percentage: occupation.score,
                        description: occupation.strength,
                      }}
                      workingConditions={{
                        title: occupation.workCondition,
                        percentage: occupation.score,
                        description: occupation.workCondition,
                      }}
                      preferences={{
                        title: occupation.wish,
                        percentage: occupation.score,
                        description: occupation.wish,
                      }}
                      userName={userName.replace('님', '')}
                      onJobPostingClick={() => {
                        console.log(
                          '채용공고 확인하기 clicked for:',
                          occupation.occupationName
                        );
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-4">
                <p className="text-chat-message">
                  추천 결과를 불러올 수 없습니다.
                </p>
              </div>
            )}
          </div>
        )}
      </MessageSection>

      {/* 입력창 */}
      <div className="absolute bottom-[4.8vh] w-full max-w-[1200px] flex justify-center">
        <ChatInput
          value={textInput}
          onChange={setTextInput}
          onSend={handleCompleteClick}
        />
      </div>
    </div>
  );
}
