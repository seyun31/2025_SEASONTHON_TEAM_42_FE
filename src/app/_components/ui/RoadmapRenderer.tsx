'use client';

import { ReactNode } from 'react';

interface RoadmapStep {
  id: number;
  name: string;
  position: { x: number; y: number };
  completed: boolean;
}

interface RoadmapRendererProps {
  roadmapSteps: RoadmapStep[];
  strokeColor?: string;
  strokeWidth?: number;
  renderStep: (step: RoadmapStep, index: number) => ReactNode;
  className?: string;
}

export default function RoadmapRenderer({
  roadmapSteps,
  strokeColor = '#FFD700',
  strokeWidth = 0.5,
  renderStep,
  className = '',
}: RoadmapRendererProps) {
  // 디버깅을 위한 데이터 출력
  console.log('RoadmapRenderer - roadmapSteps:', roadmapSteps);
  console.log('RoadmapRenderer - strokeColor:', strokeColor);
  console.log('RoadmapRenderer - strokeWidth:', strokeWidth);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* 연결선들 */}
      <svg
        className="absolute inset-0 w-full h-full z-10"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* 테스트용 고정 선 */}
        <line
          x1="10"
          y1="10"
          x2="90"
          y2="90"
          stroke="#FF0000"
          strokeWidth="5"
        />

        {roadmapSteps.map((step, index) => {
          if (index === roadmapSteps.length - 1) return null;

          const nextStep = roadmapSteps[index + 1];

          // 디버깅을 위한 콘솔 출력
          console.log(
            `Line ${index}: (${step.position.x}, ${step.position.y}) -> (${nextStep.position.x}, ${nextStep.position.y})`
          );

          return (
            <path
              key={`line-${index}`}
              d={`M ${step.position.x} ${step.position.y} L ${nextStep.position.x} ${nextStep.position.y}`}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="none"
            />
          );
        })}
      </svg>

      {/* 로드맵 단계들 */}
      {roadmapSteps.map((step, index) => (
        <div
          key={step.id}
          className="absolute flex flex-col items-center z-20"
          style={{
            left: `${step.position.x}%`,
            top: `${step.position.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {renderStep(step, index)}
        </div>
      ))}
    </div>
  );
}
