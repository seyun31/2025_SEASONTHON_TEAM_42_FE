'use client';

import React from 'react';
import MessageItem from '@/components/ui/MessageItem';
import MessageOptionItem from '../ui/MessageOptionItem';
import { ChatMessage } from '@/contexts/ChatHistoryContext';

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
  return (
    <div className="w-[53vw] h-[69.81vh] overflow-y-auto scrollbar-hide mx-auto mt-[0.3vh] mb-[20vh] flex flex-col gap-4 px-4">
      {/* 채팅 히스토리 */}
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.type === 'bot' ? 'justify-start' : 'justify-end'}`}
        >
          <MessageItem
            message={message.content}
            isBot={message.type === 'bot'}
          />
        </div>
      ))}

      {/* 시작하기 버튼 */}
      {showStartButton && (
        <div className="flex justify-end">
          <div
            className={`max-w-[30.21vw] rounded-[24px] pt-6 pb-6 pl-5 pr-5`}
            style={{ backgroundColor: '#9FC2FF66' }}
          >
            <button
              onClick={onStartClick}
              className="flex items-center justify-center border-2 border-secondary4 rounded-[100px] max-w-[30vw] px-4 py-2 cursor-pointer transition-colors text-chat-message-option bg-secondary4 text-white"
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
    </div>
  );
}
