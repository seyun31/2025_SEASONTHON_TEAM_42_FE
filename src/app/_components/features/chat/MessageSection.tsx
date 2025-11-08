'use client';

import React, { useEffect, useRef } from 'react';
import MessageItem from '@/components/ui/MessageItem';
import MessageOptionItem from '@/components/ui/MessageOptionItem';
import StrengthReportCard from '@/components/features/job/StrengthReportCard';
import FlipCard from '@/components/common/FlipCard';
import { LuRefreshCcw } from 'react-icons/lu';
import { ChatMessage } from '@/contexts/ChatHistoryContext';

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
  onRestartFromBeginning?: () => void;
  onViewHistory?: () => void;
  onGetStrengthReport?: () => void;
  onGenerateStrengthReport?: () => void;
  onJobInputClick?: () => void;
  onNavigateToStrengthReport?: () => void;
  hasStrengthReports?: boolean;
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
  onRestartFromBeginning,
  onViewHistory,
  onGetStrengthReport,
  onGenerateStrengthReport,
  onJobInputClick,
  onNavigateToStrengthReport,
  hasStrengthReports = false,
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
        {/* 헤더: 다시 결과 받기 버튼 */}
        <div className="flex justify-end cursor-pointer mb-3 lg:mr-10">
          {onGetMoreJobCards && showMoreJobCardsButton && (
            <button
              onClick={onGetMoreJobCards}
              className="text-gray-50 flex items-center gap-3 cursor-pointer"
            >
              <span className="font-pretendard font-medium text-[20px] leading-[150%] tracking-[-0.025em]">
                다시 결과 받기
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

        {/* 강점 리포트 안내 섹션 - 강점 리포트가 없는 경우에만 표시 */}
        {!hasStrengthReports && (
          <div className="text-center mt-40 mb-8">
            <div className="font-[600] text-[24px] leading-[140%] tracking-[-0.025em] font-pretendard mb-6">
              추천 직업을 위한 나만의 강점 리포트도 받아보세요!
            </div>
            <button
              onClick={onGenerateStrengthReport}
              className="px-12 py-4 bg-primary-90 text-white rounded-[16px] text-[32px] font-semibold cursor-pointer hover:bg-primary-80 transition-colors"
            >
              강점 리포트 받아보기
            </button>
          </div>
        )}
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

              {message.componentType === 'jobCards' &&
                message.componentData && (
                  <div className="mt-4">
                    {renderJobCards(message.componentData)}
                  </div>
                )}

              {message.componentType === 'historyOptions' && (
                <div className="flex justify-start ml-12 xs:ml-11 md:ml-10 lg:ml-[52px]">
                  <div className="flex flex-col gap-3 max-w-[60vw] xs:max-w-[75vw] md:max-w-[50vw] lg:max-w-[40.21vw]">
                    <button
                      onClick={onRestartFromBeginning}
                      className="flex items-center justify-center rounded-[100px] w-full px-4 xs:px-5 md:px-6 lg:px-6 py-3 xs:py-3 md:py-3 lg:py-3 cursor-pointer transition-colors bg-primary-90 text-white text-sm xs:text-base md:text-base lg:text-base font-medium hover:bg-primary-80"
                    >
                      🆕 처음부터 다시 시작하기
                    </button>
                    <button
                      onClick={onViewHistory}
                      className="flex items-center justify-center rounded-[100px] w-full px-4 xs:px-5 md:px-6 lg:px-6 py-3 xs:py-3 md:py-3 lg:py-3 cursor-pointer transition-colors bg-primary-90 text-white text-sm xs:text-base md:text-base lg:text-base font-medium hover:bg-primary-80"
                    >
                      🔁 지난 대화 내용 보기
                    </button>
                    <button
                      onClick={onGetStrengthReport}
                      className="flex items-center justify-center rounded-[100px] w-full px-4 xs:px-5 md:px-6 lg:px-6 py-3 xs:py-3 md:py-3 lg:py-3 cursor-pointer transition-colors bg-primary-90 text-white text-sm xs:text-base md:text-base lg:text-base font-medium hover:bg-primary-80"
                    >
                      ✍🏻 맞춤형 강점리포트 다시 받기
                    </button>
                  </div>
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

      {/* 강점 리포트 생성하기 버튼 섹션 */}
      {groupedMessages.some(
        (msg) => msg.componentType === 'strengthReportButton'
      ) && (
        <div className="text-center md:mt-40 mt-30 mb-8">
          <div className="font-[600] md:text-[24px] text-[20px] leading-[140%] tracking-[-0.025em] font-pretendard mb-6">
            추천 직업을 위한 <br /> 나만의 강점 리포트도 받아보세요!
          </div>
          <button
            onClick={onGenerateStrengthReport}
            className="px-12 py-4 bg-primary-90 text-white rounded-[16px] md:rounded-[24px] md:text-[32px] text-[24px] font-semibold cursor-pointer"
          >
            강점 리포트 생성하기
          </button>
        </div>
      )}

      {/* 강점 리포트 페이지 이동 버튼 섹션 */}
      {groupedMessages.some(
        (msg) => msg.componentType === 'strengthReportPageButton'
      ) && (
        <div className="text-center md:mt-30 mt-20 mb-8">
          <div className="font-[600] md:text-[24px] text-[20px] leading-[140%] tracking-[-0.025em] font-pretendard mb-6">
            더 자세한 내용을 보시려면 <br /> 페이지로 이동해보세요!
          </div>
          <button
            onClick={onNavigateToStrengthReport}
            className="px-12 py-4 bg-primary-90 text-white rounded-[16px] md:rounded-[24px] md:text-[32px] text-[24px] font-semibold cursor-pointer"
          >
            강점 리포트 페이지로
          </button>
        </div>
      )}

      {/* 직업 입력 버튼 섹션 */}
      {groupedMessages.some(
        (msg) => msg.componentType === 'jobInputButton'
      ) && (
        <div className="flex justify-end">
          <div
            className={`max-w-[80vw] xs:max-w-[70vw] md:max-w-[40vw] lg:max-w-[30.21vw] rounded-[16px] xs:rounded-[20px] md:rounded-[24px] lg:rounded-[24px] pt-4 xs:pt-5 md:pt-6 lg:pt-6 pb-4 xs:pb-5 md:pb-6 lg:pb-6 pl-3 xs:pl-4 md:pl-5 lg:pl-5 pr-3 xs:pr-4 md:pr-5 lg:pr-5`}
            style={{ backgroundColor: '#9FC2FF66' }}
          >
            <button
              onClick={onJobInputClick}
              className="flex items-center justify-center border-2 border-secondary4 rounded-[100px] w-full max-w-[70vw] xs:max-w-[60vw] md:max-w-[35vw] lg:max-w-[30vw] px-3 xs:px-4 md:px-4 lg:px-4 py-2 xs:py-2 md:py-2 lg:py-2 cursor-pointer transition-colors text-chat-message-option bg-secondary4 text-white text-sm xs:text-base md:text-base lg:text-base"
            >
              ✍🏻 준비 중인 직업 입력하고 강점리포트 받기
            </button>
          </div>
        </div>
      )}

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
