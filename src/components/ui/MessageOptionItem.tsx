'use client';

import MessageOption from './MessageOption';
import MessageOptionComplete from './MessageOptionComplete';

interface MessageOptionItemProps {
  options: string[];
  selectedOptions?: string[];
  onOptionClick?: (option: string) => void;
  onCompleteClick?: () => void;
  placeholder?: string;
}

export default function MessageOptionItem({
  options,
  selectedOptions = [],
  onOptionClick,
  onCompleteClick,
  placeholder = '선택완료',
}: MessageOptionItemProps) {
  return (
    <div
      className="max-w-[30.21vw] rounded-[24px] pt-6 pb-6 pl-5 pr-5"
      style={{ backgroundColor: '#9FC2FF66' }}
    >
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {options.map((option, index) => (
          <MessageOption key={index} onClick={() => onOptionClick?.(option)}>
            {option}
          </MessageOption>
        ))}
      </div>
      <div className="flex justify-center">
        <MessageOptionComplete onClick={onCompleteClick}>
          {placeholder}
        </MessageOptionComplete>
      </div>
      <div className="text-center mt-4">
        <p className="text-chat-message">
          마음에 드는 선택지가 없다면 아래 채팅에 편하게 적어주세요!
        </p>
      </div>
    </div>
  );
}
