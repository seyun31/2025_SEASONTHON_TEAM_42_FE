'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockRoadmapData } from '@/data/roadmapData';
import {
  RoadmapStep,
  ChecklistItem,
  RoadmapChecklist,
  RoadMapResponse,
  ActionDto,
} from '@/types/roadmap';
import { PiStarThin } from 'react-icons/pi';
import { HiStar } from 'react-icons/hi';
import { toggleRoadMapAction } from '@/apis/jobApi';

interface UserCheckListProps {
  userName: string;
  hasRoadmap?: boolean;
  roadmapData?: RoadMapResponse | null;
  onRoadmapUpdate?: () => void;
}

export default function UserCheckList({
  userName,
  hasRoadmap = true,
  roadmapData,
  onRoadmapUpdate,
}: UserCheckListProps) {
  const router = useRouter();
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [checklistItems, setChecklistItems] = useState<RoadmapChecklist>(
    mockRoadmapData.checklists
  );
  const [apiRoadmapSteps, setApiRoadmapSteps] = useState<
    RoadMapResponse['steps']
  >([]);

  // API 데이터를 UI용 데이터로 변환
  useEffect(() => {
    if (roadmapData) {
      setApiRoadmapSteps(roadmapData.steps);

      // API 데이터를 체크리스트 형태로 변환
      const convertedChecklists: RoadmapChecklist = {};
      roadmapData.steps.forEach((step, stepIndex) => {
        convertedChecklists[stepIndex + 1] = step.actions.map(
          (action, actionIndex) => ({
            id: actionIndex + 1,
            text: action.action,
            completed: action.isCompleted,
          })
        );
      });
      setChecklistItems(convertedChecklists);
    } else {
      // API 데이터가 없으면 빈 배열로 설정하여 기존 UI 표시
      setApiRoadmapSteps([]);
      setChecklistItems(mockRoadmapData.checklists);
    }
  }, [roadmapData]);

  const toggleChecklistItem = async (stepId: number, itemId: number) => {
    try {
      // RoadMapStep에서 roadMapId 가져오기
      const step = apiRoadmapSteps[stepId - 1];
      if (!step) {
        throw new Error('Step not found');
      }

      // ActionDto의 roadMapActionId 필드 사용
      const action = step.actions[itemId - 1];
      if (!action) {
        throw new Error('Action not found');
      }

      await toggleRoadMapAction(step.roadMapId, action.roadMapActionId);

      // 성공 시 로컬 상태 업데이트
      setChecklistItems((prev: RoadmapChecklist) => ({
        ...prev,
        [stepId]: prev[stepId].map((item: ChecklistItem) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        ),
      }));

      // API 데이터도 업데이트
      setApiRoadmapSteps((prev) =>
        prev.map((s, sIndex) =>
          sIndex === stepId - 1
            ? {
                ...s,
                actions: s.actions.map((a, aIndex) =>
                  aIndex === itemId - 1
                    ? { ...a, isCompleted: !a.isCompleted }
                    : a
                ),
              }
            : s
        )
      );

      // 부모 컴포넌트에 업데이트 알림
      if (onRoadmapUpdate) {
        onRoadmapUpdate();
      }
    } catch (error) {
      console.error('체크리스트 토글 실패:', error);
      // 에러 발생 시에는 로컬 상태를 되돌리지 않음 (사용자 경험을 위해)
    }
  };
  // 로드맵이 없거나 API 데이터가 없는 경우
  if (!hasRoadmap || !roadmapData) {
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
          <button
            onClick={() => router.push('/ai-chat/roadmap')}
            className="bg-primary-90 hover:bg-green-600 text-white px-8 py-4 rounded-2xl text-title-large font-medium transition-colors"
          >
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
              {/* 동적 연결선들 */}
              {(() => {
                const steps =
                  apiRoadmapSteps.length > 0
                    ? apiRoadmapSteps.map((_, index) => {
                        const positions = [
                          { x: 12, y: 35 },
                          { x: 38, y: 70 },
                          { x: 62, y: 30 },
                          { x: 90, y: 5 },
                        ];
                        return positions[index] || { x: 50, y: 50 };
                      })
                    : mockRoadmapData.steps.map((step) => step.position);

                return steps.map((step, index) => {
                  if (index === steps.length - 1) return null;

                  const nextStep = steps[index + 1];

                  return (
                    <path
                      key={`line-${index}`}
                      d={`M ${step.x} ${step.y} L ${nextStep.x} ${nextStep.y}`}
                      stroke="#FFD700"
                      strokeWidth="2"
                      fill="none"
                    />
                  );
                });
              })()}
            </svg>

            {/* 로드맵 단계들 */}
            {apiRoadmapSteps.length > 0
              ? apiRoadmapSteps.map((step, index) => {
                  // API 데이터를 UI용 포지션으로 매핑
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

                  return (
                    <div
                      key={index + 1}
                      className="absolute flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                      style={{
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      onClick={() => setSelectedStepId(index + 1)}
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
                          {allActionsCompleted && (
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
                          top: position.y > 50 ? '40px' : '40px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                        }}
                      >
                        {step.category}
                      </span>
                    </div>
                  );
                })
              : mockRoadmapData.steps.map((step) => (
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
            {roadmapData
              ? `D-${roadmapData.roadmapInputResponse.dday}`
              : mockRoadmapData.careerInfo.dDay}
          </div>
          <div className="text-gray-800 text-title-xlarge">
            {roadmapData
              ? roadmapData.roadmapInputResponse.career
              : mockRoadmapData.careerInfo.jobTitle}
          </div>
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex flex-col gap-2">
              <div className="text-gray-50 text-body-medium">
                보유 경험/자격증
              </div>
              <div className="text-gray-800 text-body-large">
                {roadmapData
                  ? roadmapData.roadmapInputResponse.experience
                  : mockRoadmapData.careerInfo.experience}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-gray-50 text-body-medium">
                목표 취업 기간
              </div>
              <div className="text-gray-800 text-body-large">
                {roadmapData
                  ? roadmapData.roadmapInputResponse.period
                  : mockRoadmapData.careerInfo.targetPeriod}
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
                  {apiRoadmapSteps.length > 0
                    ? apiRoadmapSteps[selectedStepId - 1]?.category || '단계'
                    : mockRoadmapData.steps.find(
                        (step) => step.id === selectedStepId
                      )?.name || '단계'}
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
                <div
                  className="relative"
                  style={{
                    height: `${(checklistItems[selectedStepId]?.length || 0) * 45 + 40}px`,
                  }}
                >
                  {checklistItems[selectedStepId]?.map((item, index) => {
                    // 지그재그 패턴으로 y좌표 설정 (왼쪽-오른쪽-왼쪽-오른쪽...)
                    const isLeft = index % 2 === 0;
                    const yPosition = 20 + index * 45; // 각 항목마다 45px 간격 (기존 60px에서 줄임)
                    const xPosition = isLeft ? 0 : 50; // 왼쪽은 0px, 오른쪽은 200px

                    return (
                      <div
                        key={item.id}
                        className="absolute flex items-center gap-4"
                        style={{
                          left: `${xPosition}px`,
                          top: `${yPosition}px`,
                          width: '300px',
                        }}
                      >
                        <div
                          className="flex flex-col items-center"
                          style={{ zIndex: 10 }}
                        >
                          <button
                            onClick={() =>
                              toggleChecklistItem(selectedStepId, item.id)
                            }
                            className="hover:scale-110 transition-transform cursor-pointer"
                          >
                            {item.completed ? (
                              <HiStar className="w-12 h-12 text-secondary2" />
                            ) : (
                              <PiStarThin className="bg-white w-12 h-12 text-gray-300" />
                            )}
                          </button>
                        </div>
                        <div className="flex-1">
                          <span
                            className={`text-body-large cursor-pointer whitespace-nowrap ${
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
                    );
                  })}

                  {/* ===== 체크리스트 별 아이콘들 사이의 연결선 그리기 ===== */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 0 }}
                  >
                    {checklistItems[selectedStepId]?.map((item, index) => {
                      // 마지막 항목은 연결선이 필요 없음
                      if (
                        index ===
                        (checklistItems[selectedStepId]?.length || 0) - 1
                      )
                        return null;

                      // 다음 별이 완료된 상태인지 확인 (현재 별은 완료 여부와 관계없이)
                      const nextItem =
                        checklistItems[selectedStepId][index + 1];
                      if (!nextItem || !nextItem.completed) {
                        return null; // 다음 별이 완료되지 않았으면 연결선을 그리지 않음
                      }

                      // 현재 별과 다음 별의 위치 계산
                      const isLeft = index % 2 === 0; // 현재 별이 왼쪽에 있는지 확인
                      const nextIsLeft = (index + 1) % 2 === 0; // 다음 별이 왼쪽에 있는지 확인

                      // Y좌표: 20px 시작 + (인덱스 * 45px 간격) + 24px(별 크기의 절반)
                      const currentY = 20 + index * 45 + 24; // 현재 별의 중심점 Y
                      const nextY = 20 + (index + 1) * 45 + 24; // 다음 별의 중심점 Y

                      // X좌표: 왼쪽은 24px, 오른쪽은 74px (별 크기의 절반 고려)
                      const currentX = isLeft ? 24 : 74; // 현재 별의 중심점 X
                      const nextX = nextIsLeft ? 24 : 74; // 다음 별의 중심점 X

                      // 디버깅용 로그
                      console.log(
                        `연결선 ${index}: (${currentX}, ${currentY}) -> (${nextX}, ${nextY}) - 다음별 완료됨`
                      );

                      // SVG path로 직선 연결선 그리기
                      return (
                        <path
                          key={`line-${index}`}
                          d={`M ${currentX} ${currentY} L ${nextX} ${nextY}`} // M: 시작점, L: 직선으로 연결
                          stroke="#FFD700" // 더 진한 노란색
                          strokeWidth="3" // 선 두께 증가
                          fill="none" // 채우기 없음
                        />
                      );
                    })}
                  </svg>
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
