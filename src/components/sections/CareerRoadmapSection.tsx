'use client';

import { useEffect, useState } from 'react';
import { getUserData } from '@/lib/auth';

// 별 모양 SVG 컴포넌트
const StarIcon = ({
  filled = false,
  className = '',
}: {
  filled?: boolean;
  className?: string;
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={filled ? 'white' : 'none'}
      stroke="white"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export default function CareerRoadmapSection() {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const userData = getUserData();
    if (userData?.name) {
      setUserName(userData.name);
    }
  }, []);

  const roadmapSteps = [
    { id: 1, name: '준비', position: { x: 15, y: 60 }, completed: true },
    { id: 2, name: '성장', position: { x: 35, y: 75 }, completed: true },
    { id: 3, name: '도전', position: { x: 55, y: 50 }, completed: false },
    { id: 4, name: '달성', position: { x: 75, y: 25 }, completed: false },
  ];

  return (
    <section className="w-full px-4 py-8">
      <div className="max-w-[1200px] mx-auto">
        <div
          className="relative rounded-2xl p-8 text-white overflow-hidden h-[420px] w-[1200px] flex-shrink-0"
          style={{
            backgroundImage: 'url(/assets/Icons/roadmap_bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* 배경 오버레이 */}
          <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>

          {/* 콘텐츠 */}
          <div className="relative z-10 h-full flex flex-col">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-8">
              <div className="bg-white/40 rounded-2xl px-3 py-2 flex items-center gap-3 ">
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

            {/* 로드맵 차트 또는 로그인 안내 */}
            <div className="flex-1 relative flex items-center justify-center">
              {userName ? (
                <>
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    {/* 연결선들 */}
                    <path
                      d="M 15 60 Q 25 70 35 75"
                      stroke="#FFD700"
                      strokeWidth="0.8"
                      fill="none"
                    />
                    <path
                      d="M 35 75 Q 45 60 55 50"
                      stroke="white"
                      strokeWidth="0.8"
                      fill="none"
                    />
                    <path
                      d="M 55 50 Q 65 35 75 25"
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
                        <StarIcon filled={step.completed} className="w-6 h-6" />
                      </div>
                      <span className="text-white text-sm font-medium">
                        {step.name}
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center bg-white/40 rounded-2xl px-3 py-2 flex items-center gap-3">
                  <p className="text-black text-title-xlarge opacity-90">
                    로그인 하시고
                    <br />
                    취업 로드맵 받아보세요!
                  </p>
                  {/* <button className="bg-white text-primary-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    로그인하기
                  </button> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
