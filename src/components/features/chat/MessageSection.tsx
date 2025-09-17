'use client';

import React, { useEffect, useRef } from 'react';
import MessageItem from '@/components/ui/MessageItem';
import MessageOptionItem from '@/components/ui/MessageOptionItem';
import StrengthReportCard from '@/components/features/job/StrengthReportCard';
import FlipCard from '@/components/common/FlipCard';
import { ChatMessage } from '@/contexts/ChatHistoryContext';

interface Occupation {
  imageUrl: string;
  occupationName: string;
  description: string;
  strength: string;
  score: string;
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
  children,
}: MessageSectionProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const renderJobCards = (componentData: unknown): React.ReactNode => {
    const jobData = componentData as {
      first: Occupation;
      second: Occupation;
      third: Occupation;
    };
    return (
      <div className="flex gap-4 w-full mt-4">
        {[jobData.first, jobData.second, jobData.third].map(
          (occupation: Occupation, jobIndex: number) => (
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
              onJobPostingClick={() => {
                console.log(
                  '채용공고 확인하기 clicked for:',
                  occupation.occupationName
                );
              }}
            />
          )
        )}
      </div>
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    // <div className="max-w-[1200px] mx-auto">
    <div className="w-full h-[70vh] xs:h-[65vh] md:h-[69.81vh] lg:h-[65vh] overflow-y-auto scrollbar-hide mx-auto mt-[0.3vh] mb-[20vh] xs:mb-[22vh] md:mb-[25vh] lg:mb-[25vh] flex flex-col gap-2 xs:gap-3 md:gap-4 lg:gap-4 px-4 md:px-8 lg:px-0">
      {/* 채팅 히스토리 */}
      {messages.map((message, index) => {
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
              {message.componentType === 'strengthReport' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-6">
                  <StrengthReportCard
                    title="분석형 전문가"
                    experience="데이터 분석 및 해석 경험"
                    keywords={['논리적 사고', '문제 해결', '데이터 해석']}
                    jobs={['데이터 분석가', '리서치 전문가']}
                    iconType="dart"
                  />
                  <StrengthReportCard
                    title="조정형 전문가"
                    experience="팀 조율 및 의견 중재 경험"
                    keywords={['소통 능력', '중재 역량', '팀워크']}
                    jobs={['프로젝트 매니저', 'HR 전문가']}
                    iconType="check"
                  />
                  <StrengthReportCard
                    title="조정형 전문가"
                    experience="팀 조율 및 의견 중재 경험"
                    keywords={['소통 능력', '중재 역량', '팀워크']}
                    jobs={['프로젝트 매니저', 'HR 전문가']}
                    iconType="memo"
                  />
                  <StrengthReportCard
                    title="조정형 전문가"
                    experience="팀 조율 및 의견 중재 경험"
                    keywords={['소통 능력', '중재 역량', '팀워크']}
                    jobs={['프로젝트 매니저', 'HR 전문가']}
                    iconType="led"
                  />
                </div>
              )}

              {message.componentType === 'loading' && (
                <div className="text-center p-4">
                  <p className="text-chat-message">
                    맞춤형 직업을 추천하는 중...
                  </p>
                </div>
              )}

              {message.componentType === 'jobCards' && message.componentData
                ? renderJobCards(message.componentData)
                : null}
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
