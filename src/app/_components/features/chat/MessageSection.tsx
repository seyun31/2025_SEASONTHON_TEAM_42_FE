'use client';

import React, { useEffect, useRef } from 'react';
import MessageItem from '@/components/ui/MessageItem';
import MessageOptionItem from '@/components/ui/MessageOptionItem';
import StrengthReportCard from '@/components/features/job/StrengthReportCard';
import FlipCard from '@/components/common/FlipCard';
import { LuRefreshCcw } from 'react-icons/lu';
import { ChatMessage } from '@/contexts/ChatHistoryContext';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface StrengthReportData {
  strength: string;
  experience: string;
  keyword: string[];
  job: string[];
}

interface Occupation {
  imageUrl: string;
  occupationName: string;
  description: string;
  strength: string;
  score: string;
  memberOccupationId?: number;
  isBookmark?: boolean;
}

interface MessageSectionProps {
  messages: ChatMessage[];
  showStartButton?: boolean;
  showQuestionOptions?: boolean;
  currentQuestionOptions?: string[];
  selectedOptions?: string[];
  canSkip?: boolean;
  onStartClick?: () => void;
  onOptionClick?: (option: string) => void;
  onCompleteClick?: () => void;
  onSkipClick?: () => void;
  onGetMoreJobCards?: () => void;
  showMoreJobCardsButton?: boolean;
  children?: React.ReactNode;
}

export default function MessageSection({
  messages,
  showStartButton = false,
  showQuestionOptions = false,
  currentQuestionOptions = [],
  selectedOptions = [],
  canSkip = false,
  onStartClick,
  onOptionClick,
  onCompleteClick,
  onSkipClick,
  onGetMoreJobCards,
  showMoreJobCardsButton = false,
  children,
}: MessageSectionProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 강점 리포트 메시지들 그룹화 (순서대로 정렬)
  const groupStrengthReports = (msgs: ChatMessage[]): ChatMessage[] => {
    const grouped: ChatMessage[] = [];
    const strengthReports: ChatMessage[] = [];

    for (let i = 0; i < msgs.length; i++) {
      const msg = msgs[i];
      if (msg.componentType === 'strengthReport') {
        strengthReports.push(msg);
      } else {
        if (strengthReports.length > 0) {
          const reportDataArray = strengthReports
            .map((r) => r.componentData)
            .filter(
              (data): data is StrengthReportData =>
                data !== null && data !== undefined && 'strength' in data
            );

          const groupedMessage: ChatMessage = {
            ...strengthReports[0],
            id: 'strength-reports-group',
            componentData: reportDataArray,
            componentType: 'strengthReportGroup',
          };
          grouped.push(groupedMessage);
          strengthReports.length = 0;
        }
        grouped.push(msg);
      }
    }

    if (strengthReports.length > 0) {
      const reportDataArray = strengthReports
        .map((r) => r.componentData)
        .filter(
          (data): data is StrengthReportData =>
            data !== null && data !== undefined && 'strength' in data
        );

      const groupedMessage: ChatMessage = {
        ...strengthReports[0],
        id: 'strength-reports-group',
        componentData: reportDataArray,
        componentType: 'strengthReportGroup',
      };
      grouped.push(groupedMessage);
    }

    return grouped;
  };

  const groupedMessages = groupStrengthReports(messages);

  const renderJobCards = (componentData: unknown): React.ReactNode => {
    const jobData = componentData as {
      first: Occupation;
      second: Occupation;
      third: Occupation;
    };

    // jobData가 유효한지 확인
    if (!jobData || typeof jobData !== 'object') {
      return null;
    }

    // 각 직업 데이터가 유효한지 확인
    const validOccupations = [
      jobData.first,
      jobData.second,
      jobData.third,
    ].filter(
      (occupation) =>
        occupation &&
        typeof occupation === 'object' &&
        occupation.occupationName
    );

    if (validOccupations.length === 0) {
      return null;
    }

    return (
      <div className="w-full mt-4">
        {/* 헤더: 추천 직업 카드 더 받기 버튼 */}
        <div className="flex justify-end cursor-pointer mb-3 lg:mr-10">
          {onGetMoreJobCards && showMoreJobCardsButton && (
            <button
              onClick={onGetMoreJobCards}
              className="text-gray-50 flex items-center gap-3 cursor-pointer"
            >
              <span className="font-pretendard font-medium text-[20px] leading-[150%] tracking-[-0.025em]">
                추천 직업 카드 더 받기
              </span>
              <LuRefreshCcw className="w-6 h-6 text-gray-50" />
            </button>
          )}
        </div>

        {/* 직업 카드들 */}
        <div className="flex gap-4 w-full overflow-x-auto scrollbar-hide">
          {validOccupations.map((occupation: Occupation, jobIndex: number) => (
            <FlipCard
              key={jobIndex}
              jobImage={occupation.imageUrl}
              jobTitle={occupation.occupationName}
              jobDescription={occupation.description}
              recommendationScore={parseInt(occupation.score) || 0}
              strengths={{
                title: occupation.strength,
                percentage: parseInt(occupation.score) || 0,
                description: occupation.strength,
              }}
              memberOccupationId={occupation.memberOccupationId}
              isBookmark={occupation.isBookmark}
              onJobPostingClick={() => {}}
            />
          ))}
        </div>
      </div>
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [groupedMessages]);

  return (
    // <div className="max-w-[1200px] mx-auto">
    <div className="w-full h-[70vh] xs:h-[65vh] md:h-[69.81vh] lg:h-[65vh] overflow-y-auto scrollbar-hide mx-auto mt-[0.3vh] mb-[20vh] xs:mb-[22vh] md:mb-[25vh] lg:mb-[25vh] flex flex-col gap-2 xs:gap-3 md:gap-4 lg:gap-4 px-4 md:px-8 xl:px-0">
      {/* 채팅 히스토리 */}
      {groupedMessages.map((message, index) => {
        // 컴포넌트 타입 메시지 처리
        if (message.type === 'component') {
          return (
            <div
              key={message.id}
              className="w-full animate-fadeInUp"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both',
              }}
            >
              {message.componentType === 'strengthReportGroup' &&
                Array.isArray(message.componentData) && (
                  <div className="w-full mt-4 mb-4">
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide md:grid md:grid-cols-2 md:overflow-visible">
                      {message.componentData.map(
                        (reportData, cardIndex) =>
                          reportData &&
                          'strength' in reportData && (
                            <div
                              key={cardIndex}
                              className="flex-shrink-0 w-[360px] md:w-auto"
                            >
                              <StrengthReportCard
                                title={reportData.strength}
                                experience={reportData.experience}
                                keywords={reportData.keyword}
                                jobs={reportData.job}
                                iconType={
                                  (['dart', 'check', 'memo', 'led'] as const)[
                                    cardIndex % 4
                                  ]
                                }
                              />
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}

              {message.componentType === 'strengthReport' &&
                message.componentData &&
                'strength' in message.componentData && (
                  <div className="w-full max-w-[360px] md:max-w-[600px] mt-4 mb-4">
                    <div className="grid grid-cols-2 gap-3">
                      <StrengthReportCard
                        title={message.componentData.strength}
                        experience={message.componentData.experience}
                        keywords={message.componentData.keyword}
                        jobs={message.componentData.job}
                        iconType={
                          (['dart', 'check', 'memo', 'led'] as const)[index % 4]
                        }
                      />
                    </div>
                  </div>
                )}

              {message.componentType === 'loading' && (
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
              )}

              {message.componentType === 'jobCards' &&
                message.componentData && (
                  <div className="mt-4">
                    {renderJobCards(message.componentData)}
                  </div>
                )}
            </div>
          );
        }

        // 일반 메시지 처리
        return (
          <div
            key={message.id}
            className={`flex ${message.type === 'bot' ? 'justify-start' : 'justify-end'} animate-fadeInUp`}
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both',
            }}
          >
            <MessageItem
              message={message.content}
              isBot={message.type === 'bot'}
            />
          </div>
        );
      })}

      {/* 시작하기 버튼 */}
      {showStartButton && (
        <div className="flex justify-end">
          <div
            className={`max-w-[80vw] xs:max-w-[70vw] md:max-w-[40vw] lg:max-w-[30.21vw] rounded-[16px] xs:rounded-[20px] md:rounded-[24px] lg:rounded-[24px] pt-4 xs:pt-5 md:pt-6 lg:pt-6 pb-4 xs:pb-5 md:pb-6 lg:pb-6 pl-3 xs:pl-4 md:pl-5 lg:pl-5 pr-3 xs:pr-4 md:pr-5 lg:pr-5`}
            style={{ backgroundColor: '#9FC2FF66' }}
          >
            <button
              onClick={onStartClick}
              className="flex items-center justify-center border-2 border-secondary4 rounded-[100px] w-full max-w-[70vw] xs:max-w-[60vw] md:max-w-[35vw] lg:max-w-[30vw] px-3 xs:px-4 md:px-4 lg:px-4 py-2 xs:py-2 md:py-2 lg:py-2 cursor-pointer transition-colors text-chat-message-option bg-secondary4 text-white text-sm xs:text-base md:text-base lg:text-base"
            >
              시작하기
            </button>
          </div>
        </div>
      )}

      {/* 선택지가 있는 경우 */}
      {showQuestionOptions && (
        <div className="flex justify-end">
          <MessageOptionItem
            options={currentQuestionOptions}
            selectedOptions={selectedOptions}
            onOptionClick={onOptionClick}
            onCompleteClick={onCompleteClick}
            onSkipClick={canSkip ? onSkipClick : undefined}
          />
        </div>
      )}

      {/* 추가 콘텐츠 */}
      {children}

      {/* 스크롤을 위한 빈 div */}
      <div ref={messagesEndRef} />
    </div>
  );
}
