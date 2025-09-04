'use client';

import MessageOption from './MessageOption';
import MessageOptionComplete from './MessageOptionComplete';
import MessageOptionSkip from './MessageOptionSkip';

interface MessageOptionItemProps {
  options: string[];
  selectedOptions?: string[];
  onOptionClick?: (option: string) => void;
  onCompleteClick?: () => void;
  onSkipClick?: () => void;
  placeholder?: string;
}

export default function MessageOptionItem({
  options,
  selectedOptions = [],
  onOptionClick,
  onCompleteClick,
  onSkipClick,
}: MessageOptionItemProps) {
  return (
    <div
      className="max-w-[30.21vw] rounded-[24px] pt-6 pb-6 pl-5 pr-5"
      style={{ backgroundColor: '#9FC2FF66' }}
    >
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {options.map((option, index) => (
          <MessageOption key={index} onClick={() => onOptionClick?.(option)}>
            {option}
          </MessageOption>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {onSkipClick && (
          <MessageOptionSkip onClick={onSkipClick}>건너뛰기</MessageOptionSkip>
        )}
        {onCompleteClick && (
          <MessageOptionComplete onClick={onCompleteClick}>
            선택완료
          </MessageOptionComplete>
        )}
      </div>
      <div className="text-center mt-8">
        <p className="text-chat-message">
          마음에 드는 선택지가 없다면 아래 채팅에 편하게 적어주세요!
        </p>
      </div>
    </div>
  );
}
