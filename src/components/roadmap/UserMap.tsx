'use client';

import { RoadMapResponse } from '@/types/roadmap';

// 별 모양 SVG 컴포넌트
const StarIcon = ({
  filled = false,
  className = '',
}: {
  filled?: boolean;
  className?: string;
}) => (
  <div className={`relative ${className}`}>
    {/* 뒤에 고정된 흰색 별 */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 50 48"
      fill="none"
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <path
        d="M21.499 2.33531C23.0208 -0.418424 26.9792 -0.418424 28.501 2.33531L33.5111 11.4015C34.0847 12.4395 35.0894 13.1695 36.2539 13.3943L46.4246 15.3576C49.5138 15.9539 50.737 19.7186 48.5883 22.0168L41.5141 29.5833C40.7041 30.4497 40.3204 31.6308 40.4664 32.8078L41.7421 43.0873C42.1296 46.2096 38.9271 48.5363 36.0774 47.203L26.6952 42.8131C25.6209 42.3105 24.3791 42.3105 23.3048 42.8131L13.9226 47.203C11.0729 48.5363 7.87041 46.2096 8.25788 43.0873L9.53358 32.8078C9.67965 31.6308 9.29588 30.4497 8.48591 29.5833L1.41167 22.0168C-0.737031 19.7186 0.486203 15.9539 3.57541 15.3576L13.7461 13.3943C14.9106 13.1695 15.9153 12.4395 16.4889 11.4015L21.499 2.33531Z"
        fill="white"
      />
    </svg>

    {/* 완료 상태일 때만 앞에 노란색 별 */}
    {filled && (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        viewBox="0 0 36 34"
        fill="none"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
      >
        <path
          d="M14.499 2.33531C16.0208 -0.418427 19.9792 -0.418425 21.501 2.33531L24.0001 6.8576C24.5737 7.89564 25.5784 8.6256 26.7429 8.85039L31.8161 9.82971C34.9053 10.426 36.1286 14.1908 33.9799 16.489L30.4512 20.2632C29.6412 21.1296 29.2574 22.3107 29.4035 23.4876L30.0398 28.6152C30.4273 31.7375 27.2248 34.0642 24.3751 32.7308L19.6952 30.5411C18.6209 30.0385 17.3791 30.0385 16.3048 30.5411L11.6249 32.7308C8.77515 34.0642 5.57269 31.7375 5.96016 28.6152L6.5965 23.4876C6.74256 22.3107 6.3588 21.1296 5.54882 20.2632L2.02013 16.489C-0.12858 14.1908 1.09466 10.426 4.18386 9.8297L9.25708 8.85039C10.4216 8.6256 11.4263 7.89564 11.9999 6.8576L14.499 2.33531Z"
          fill="#E1DC53"
        />
      </svg>
    )}
  </div>
);

interface UserMapProps {
  userName: string;
  roadmapData?: RoadMapResponse | null;
  onRoadmapUpdate?: () => void;
}

export default function UserMap({
  userName,
  roadmapData,
  onRoadmapUpdate,
}: UserMapProps) {
  // API 데이터가 있으면 사용하고, 없으면 기본 데이터 사용
  const roadmapSteps = roadmapData
    ? roadmapData.steps.map((step, index) => {
        const positions = [
          { x: 12, y: 35 },
          { x: 38, y: 70 },
          { x: 62, y: 30 },
          { x: 90, y: 5 },
        ];
        const position = positions[index] || { x: 50, y: 50 };

        // actions의 모든 isCompleted가 true인지 확인
        const allActionsCompleted =
          step.actions.length > 0 &&
          step.actions.every((action) => action.isCompleted);

        return {
          id: index + 1,
          name: step.category,
          position,
          completed: allActionsCompleted,
        };
      })
    : [
        { id: 1, name: '준비', position: { x: 12, y: 35 }, completed: true },
        { id: 2, name: '성장', position: { x: 38, y: 70 }, completed: true },
        { id: 3, name: '도전', position: { x: 62, y: 30 }, completed: false },
        { id: 4, name: '달성', position: { x: 90, y: 5 }, completed: false },
      ];

  return (
    <div
      className="relative rounded-2xl p-8 text-white overflow-hidden h-[400px] w-[844px] flex-shrink-0"
      style={{
        backgroundImage: 'url(/assets/Icons/roadmap_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>

      {/* 콘텐츠 */}
      <div className="relative z-10 h-full flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="bg-white/40 rounded-2xl px-3 py-2 flex items-center gap-3">
            <span className="text-black text-title-medium">
              {userName ? `${userName}님의 취업 로드맵` : '취업 로드맵'}
            </span>
            {userName && (
              <span className="text-black text-body-medium-medium">
                자세히보기 &gt;
              </span>
            )}
          </div>
        </div>

        {/* 로드맵 차트 */}
        <div className="flex-1 relative flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* 연결선들 */}
            <path
              d="M 12 35 Q 25 52 38 70"
              stroke="#FFD700"
              strokeWidth="0.8"
              fill="none"
            />
            <path
              d="M 38 70 Q 50 50 62 30"
              stroke="white"
              strokeWidth="0.8"
              fill="none"
            />
            <path
              d="M 62 30 Q 76 17 90 5"
              stroke="white"
              strokeWidth="0.8"
              fill="none"
            />
          </svg>

          {/* 로드맵 단계들 */}
          {roadmapSteps.map((step) => (
            <div
              key={step.id}
              className="absolute flex flex-col items-center"
              style={{
                left: `${step.position.x}%`,
                top: `${step.position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="mb-2">
                <StarIcon filled={step.completed} />
              </div>
              <span
                className="text-white text-title-xlarge whitespace-nowrap"
                style={{
                  position: 'absolute',
                  top: step.position.y > 50 ? '40px' : '40px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
