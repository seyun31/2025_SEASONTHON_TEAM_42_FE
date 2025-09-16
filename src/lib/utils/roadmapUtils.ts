import { RoadMapResponse } from '@/types/roadmap';

export interface RoadmapStep {
  id: number;
  name: string;
  position: { x: number; y: number };
  completed: boolean;
}

export interface RoadmapStepPosition {
  x: number;
  y: number;
}

// 로드맵 단계별 위치 정의
export const ROADMAP_POSITIONS: RoadmapStepPosition[] = [
  { x: 15, y: 95 }, // 준비
  { x: 38, y: 62 }, // 성장
  { x: 23, y: 34 }, // 도전
  { x: 31, y: 13 }, // 달성
];

// UserMap용 위치 (자연스러운 S자 경로)
export const USER_MAP_POSITIONS: RoadmapStepPosition[] = [
  { x: 45, y: 90 }, // 준비 - 왼쪽 아래
  { x: 65, y: 50 }, // 성장 - 중앙 아래
  { x: 40, y: 20 }, // 도전 - 오른쪽 중앙
  { x: 50, y: 1 }, // 달성 - 왼쪽 위
];

// CareerRoadmapSection용 위치
export const CAREER_ROADMAP_POSITIONS: RoadmapStepPosition[] = [
  { x: 12, y: 35 },
  { x: 38, y: 70 },
  { x: 62, y: 30 },
  { x: 90, y: 5 },
];

// API 데이터를 UI용 데이터로 변환
export const convertApiDataToRoadmapSteps = (
  roadmapData: RoadMapResponse | null,
  positions: RoadmapStepPosition[] = ROADMAP_POSITIONS
): RoadmapStep[] => {
  if (!roadmapData) {
    return [];
  }

  return roadmapData.steps.map((step, index) => {
    const position = positions[index] || { x: 50, y: 50 };

    // actions의 모든 isCompleted가 true인지 확인
    const allActionsCompleted =
      step.actions.length > 0 &&
      step.actions.every((action) => action.isCompleted);

    return {
      id: step.roadMapId,
      name: step.category,
      position,
      completed: allActionsCompleted,
    };
  });
};

// 기본 로드맵 단계 데이터 (API 데이터가 없을 때 사용)
export const getDefaultRoadmapSteps = (
  positions: RoadmapStepPosition[] = ROADMAP_POSITIONS
): RoadmapStep[] => [
  {
    id: 1,
    name: '준비',
    position: positions[0] || { x: 50, y: 50 },
    completed: false,
  },
  {
    id: 2,
    name: '성장',
    position: positions[1] || { x: 50, y: 50 },
    completed: true,
  },
  {
    id: 3,
    name: '도전',
    position: positions[2] || { x: 50, y: 50 },
    completed: false,
  },
  {
    id: 4,
    name: '달성',
    position: positions[3] || { x: 50, y: 50 },
    completed: false,
  },
];

// 로드맵 단계 완료 상태 확인
export const isStepCompleted = (step: RoadMapResponse['steps'][0]): boolean => {
  return (
    step.actions.length > 0 &&
    step.actions.every((action) => action.isCompleted)
  );
};
