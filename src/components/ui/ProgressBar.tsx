import React from 'react';

interface ProgressBarProps {
  currentStep: number; // 현재 단계
  totalSteps: number; // 전체 단계
  visible?: boolean; // 진행바 표시 여부
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  visible = true,
}) => {
  const progressPercent = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <div
      className={`w-full flex flex-col gap-2 relative transition-all duration-500 ease-in-out transform ${
        visible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
      }`}
    >
      {/* 텍스트 (현재 단계/전체 단계) - 진행바 위에 표시 */}
      <div
        className="absolute progress-text text-black transition-all duration-700 ease-out"
        style={{
          left: `${Math.max(progressPercent - 2, 2)}%`,
          top: '-3vh',
          transform: visible ? 'translateY(0)' : 'translateY(-10px)',
          opacity: visible ? 1 : 0,
        }}
      >
        {currentStep}/{totalSteps}
      </div>
      {/* 진행바 */}
      <div className="relative w-full h-4 bg-gray-20 rounded-full overflow-hidden shadow-sm">
        <div
          className="absolute left-0 top-0 h-full bg-primary-90 rounded-full transition-all duration-700 ease-out transform origin-left"
          style={{
            width: `${progressPercent}%`,
            transform: `scaleX(${visible ? 1 : 0})`,
          }}
        />
        {/* 진행 중일 때 반짝이는 효과 */}
        {/* {visible && progressPercent > 0 && progressPercent < 100 && (
                  <div
                    className="absolute top-0 h-full w-6 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"
                    style={{
                      left: `${Math.max(progressPercent - 3, 0)}%`,
                      animation: 'shimmer 2s ease-in-out infinite'
                    }}
                  />
                )} */}
      </div>
    </div>
  );
};

export default ProgressBar;
