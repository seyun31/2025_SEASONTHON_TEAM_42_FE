'use client';

import { useState } from 'react';

interface RoadmapPositionProps {
  isCompleted?: boolean;
  isPressed?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function RoadmapPosition({
  isCompleted = false,
  isPressed = false,
  onClick,
  className = '',
}: RoadmapPositionProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onClick?.();

    // 클릭 후 300ms 후에 상태 리셋
    setTimeout(() => {
      setIsClicked(false);
    }, 300);
  };

  const isActive = isPressed || isClicked;

  return (
    <div
      className={`relative flex items-center justify-center w-16 h-16 ${className}`}
    >
      {/* 외부 큰 원 - active 상태일 때만 보임 */}
      {isActive && (
        <div
          className="absolute w-16 h-16 rounded-full border-8 border-white transition-all duration-300 ease-out animate-pulse"
          style={{
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* 내부 작은 원 - 항상 보임, 중앙에 위치 */}
      <div
        className={`relative w-9 h-9 rounded-full border-6 cursor-pointer transition-all duration-300 ease-out flex items-center justify-center transform ${
          isActive ? 'scale-110' : 'scale-100'
        } active:scale-95`}
        style={{
          borderColor: '#E1DC53',
          backgroundColor: isCompleted
            ? '#FFFFFF'
            : isActive
              ? '#E1DC53'
              : '#FFFFFF',
          boxShadow: isActive
            ? '0 4px 12px rgba(225, 220, 83, 0.4)'
            : '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
        onClick={handleClick}
      >
        {/* 별 아이콘 - 완료 상태일 때만 보임 */}
        {isCompleted && (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#E1DC53"
            className={`drop-shadow-sm transition-all duration-300 ${
              isActive ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
            }`}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )}
      </div>
    </div>
  );
}
