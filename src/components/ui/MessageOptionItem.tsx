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
      className="max-w-[70vw] xs:max-w-[70vw] md:max-w-[50vw] lg:max-w-[30.21vw] rounded-[24px] pt-6 pb-6 pl-5 pr-5 xs:pl-5 xs:pr-5 md:pl-4 md:pr-4 lg:pl-4 lg:pr-4"
      style={{ backgroundColor: '#9FC2FF66' }}
    >
      <div className="flex flex-wrap gap-1.5 xs:gap-2 md:gap-2 lg:gap-2 justify-center mb-4 xs:mb-6 md:mb-7 lg:mb-8">
        {options.map((option, index) => (
          <MessageOption
            key={index}
            isSelected={selectedOptions?.includes(option)}
            onClick={() => onOptionClick?.(option)}
          >
            {option}
          </MessageOption>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 xs:gap-2 md:gap-2 lg:gap-2">
        {onSkipClick && (
          <MessageOptionSkip onClick={onSkipClick}>건너뛰기</MessageOptionSkip>
        )}
        {onCompleteClick && (
          <MessageOptionComplete onClick={onCompleteClick}>
            선택완료
          </MessageOptionComplete>
        )}
      </div>
      <div className="text-center mt-4 xs:mt-6 md:mt-7 lg:mt-8">
        <p className="text-chat-message text-[14px] xs:text-[15px] md:text-base lg:text-base">
          마음에 드는 선택지가 없다면 아래 채팅에 편하게 적어주세요!
        </p>
      </div>
    </div>
  );
}
