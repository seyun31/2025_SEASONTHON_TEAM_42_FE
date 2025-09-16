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
      className={`w-full max-w-[calc(95vw-10vw)] xs:max-w-[calc(85.5vw-10vw)] md:max-w-[calc(78.125vw-10vw)] lg:max-w-[calc(51.875vw-10vw)] flex flex-col gap-0.5 xs:gap-0.5 md:gap-0.5 lg:gap-4 relative transition-all duration-500 ease-in-out transform items-center ${
        visible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
      }`}
    >
      {/* 텍스트 (현재 단계/전체 단계) - 진행바 위에 표시 */}
      <div
        className="absolute w-full flex"
        style={{
          top:
            window.innerWidth <= 375
              ? '-5vh'
              : window.innerWidth <= 768
                ? '-3.5vh'
                : window.innerWidth <= 1024
                  ? '-2.5vh'
                  : '-3.5vh',
        }}
      >
        {Array.from({ length: 10 }, (_, index) => {
          const sectionPercent = (index + 2) * 10;
          const isActive =
            progressPercent >= sectionPercent - 10 &&
            progressPercent < sectionPercent;
          return (
            <div
              key={index}
              className={`flex-1 flex justify-center text-black transition-all duration-700 ease-out text-[16px] xs:text-[18px] md:text-lg lg:text-xl ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transform:
                  visible && isActive ? 'translateY(0)' : 'translateY(-10px)',
              }}
            >
              {isActive && `${currentStep}/${totalSteps}`}
            </div>
          );
        })}
      </div>
      {/* 진행바 */}
      <div className="relative w-[calc(95vw-10vw)] xs:w-[calc(85.5vw-10vw)] md:w-[calc(78.125vw-10vw)] lg:w-[calc(51.875vw-10vw)] h-2 xs:h-2 md:h-2.5 lg:h-4 bg-gray-20 rounded-full overflow-hidden shadow-sm">
        <div
          className="absolute left-0 top-0 h-full bg-primary-90 rounded-full transition-all duration-700 ease-out transform origin-left"
          style={{
            width: `${progressPercent}%`,
            transform: `scaleX(${visible ? 1 : 0})`,
            borderRadius:
              window.innerWidth <= 375
                ? '6px'
                : window.innerWidth <= 768
                  ? '8px'
                  : '10px',
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
