'use client';

import { useState } from 'react';
import { mockRoadmapData } from '@/data/roadmapData';
import { RoadmapStep, ChecklistItem, RoadmapChecklist } from '@/types/roadmap';
import { PiStarThin } from 'react-icons/pi';
import { HiStar } from 'react-icons/hi';

interface UserCheckListProps {
  userName: string;
  hasRoadmap?: boolean;
}

export default function UserCheckList({
  userName,
  hasRoadmap = true,
}: UserCheckListProps) {
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [checklistItems, setChecklistItems] = useState<RoadmapChecklist>(
    mockRoadmapData.checklists
  );

  const toggleChecklistItem = (stepId: number, itemId: number) => {
    setChecklistItems((prev: RoadmapChecklist) => ({
      ...prev,
      [stepId]: prev[stepId].map((item: ChecklistItem) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    }));
  };
  if (!hasRoadmap) {
    // 로드맵이 없는 경우 - 상단에 로드맵 시각화, 하단에 생성 버튼
    return (
      <div className="flex flex-col gap-4">
        {/* 상단 - 로드맵 시각화 */}
        <div
          className="relative rounded-2xl p-8 text-white overflow-hidden h-[400px] w-[1200px] flex-shrink-0"
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
              </div>
            </div>
          </div>
        </div>

        {/* 하단 - AI와 함께 로드맵 생성하기 버튼 */}
        <div
          className="flex justify-center items-center flex-shrink-0 rounded-3xl"
          style={{
            width: '1200px',
            height: '400px',
            background: '#FFF',
            boxShadow: '0 4px 10px 0 rgba(17, 17, 17, 0.20)',
          }}
        >
          <button className="bg-primary-90 hover:bg-green-600 text-white px-8 py-4 rounded-2xl text-title-large font-medium transition-colors">
            AI와 함께 로드맵 생성하기
          </button>
        </div>
      </div>
    );
  }

  // 로드맵이 있는 경우 - 상단에 로드맵, 하단에 두 개의 카드
  return (
    <div className="flex flex-col gap-4">
      {/* 상단 - 로드맵 시각화 */}
      <div
        className="relative rounded-2xl p-8 text-white overflow-hidden h-[400px] w-[1200px] flex-shrink-0"
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
            {mockRoadmapData.steps.map((step) => (
              <div
                key={step.id}
                className="absolute flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                style={{
                  left: `${step.position.x}%`,
                  top: `${step.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => setSelectedStepId(step.id)}
              >
                <div className="mb-2">
                  <div className="relative">
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
                    {step.completed && (
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

      {/* 하단 - 두 개의 카드 */}
      <div className="flex gap-4">
        {/* 왼쪽 카드 - 취업 정보 */}
        <div
          className="bg-white rounded-3xl py-6 px-8"
          style={{
            width: '324px',
            height: '400px',
            background: '#FFF',
            boxShadow: '0 4px 10px 0 rgba(17, 17, 17, 0.20)',
          }}
        >
          <div className="text-primary-90 text-header-medium">
            {mockRoadmapData.careerInfo.dDay}
          </div>
          <div className="text-gray-800 text-header-medium">
            {mockRoadmapData.careerInfo.jobTitle}
          </div>
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex flex-col gap-2">
              <div className="text-gray-50 text-body-medium">
                보유 경험/자격증
              </div>
              <div className="text-gray-800 text-body-large">
                {mockRoadmapData.careerInfo.experience}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-gray-50 text-body-medium">
                목표 취업 기간
              </div>
              <div className="text-gray-800 text-body-large">
                {mockRoadmapData.careerInfo.targetPeriod}
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 카드 - 안내 및 체크리스트 */}
        <div
          className="bg-white rounded-2xl p-6 relative"
          style={{
            width: '844px',
            height: '400px',
            background: '#FFF',
            boxShadow: '0 4px 10px 0 rgba(17, 17, 17, 0.20)',
          }}
        >
          {selectedStepId ? (
            // 체크리스트 표시
            <div className="h-full flex flex-col">
              <div className="flex flex-row items-end gap-2">
                <div className="text-primary-90 text-header-medium">
                  {
                    mockRoadmapData.steps.find(
                      (step) => step.id === selectedStepId
                    )?.name
                  }
                  하기
                </div>
                <div className="text-gray-50 text-body-large-regular">
                  {(() => {
                    const currentChecklist = checklistItems[selectedStepId];
                    const allCompleted = currentChecklist?.every(
                      (item) => item.completed
                    );

                    if (allCompleted) {
                      return '모두 완료했어요! 다음 단계의 별을 눌러보세요!';
                    } else {
                      return '넥스트 커리어에 첫 걸음을 내딛어 봐요!';
                    }
                  })()}
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="space-y-4">
                  {checklistItems[selectedStepId]?.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() =>
                            toggleChecklistItem(selectedStepId, item.id)
                          }
                          className="hover:scale-110 transition-transform cursor-pointer"
                        >
                          {item.completed ? (
                            <HiStar className="w-12 h-12 text-secondary2" />
                          ) : (
                            <PiStarThin className="w-12 h-12 text-gray-300" />
                          )}
                        </button>
                        {index <
                          (checklistItems[selectedStepId]?.length || 0) - 1 && (
                          <div className="w-0.5 h-8 bg-secondary2 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <span
                          className={`text-body-large cursor-pointer ${
                            item.completed
                              ? 'text-gray-500 line-through'
                              : 'text-gray-800'
                          }`}
                          onClick={() =>
                            toggleChecklistItem(selectedStepId, item.id)
                          }
                        >
                          {item.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-4 right-4">
                <img
                  src="/assets/Icons/character_cheer.png"
                  alt="응원하는 별 캐릭터"
                  className="w-auto h-[134px]"
                />
              </div>
            </div>
          ) : (
            // 기본 안내 메시지
            <div className="h-full flex flex-col justify-center items-center">
              <div className="text-gray-800 text-title-xlarge mb-4">
                로드맵의 별을 눌러서
                <br />
                진행도를 확인하세요!
              </div>
              <div className="absolute bottom-4 right-4">
                <img
                  src="/assets/Icons/character_cheer.png"
                  alt="응원하는 별 캐릭터"
                  className="w-auto h-[134px]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
