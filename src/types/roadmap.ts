// API 응답 타입 (스웨거 기반)
export interface RoadMapResponse {
  roadmapInputResponse: RoadmapInputResponse;
  steps: RoadMapStep[];
}

export interface RoadmapInputResponse {
  career: string;
  period: string;
  experience: string;
  dday: number;
}

export interface RoadMapStep {
  roadMapId: number;
  period: string;
  category: string;
  isCompleted: boolean;
  actions: ActionDto[];
}

export interface ActionDto {
  roadMapActionId: number;
  action: string;
  isCompleted: boolean;
}

export interface RoadMapRequest {
  career: string;
  experience: string;
  period: string;
}

export interface RoadMapUpdateRequest {
  career?: string;
  experience?: string;
  period?: string;
}

export interface RoadMapCategoryUpdateItem {
  roadmapId: number | string;
  category: string;
}

export interface RoadMapCategoryUpdateRequest {
  roadmapList: RoadMapCategoryUpdateItem[];
}

// 로드맵 액션 수정 요청
export interface ActionUpdateRequest {
  action: string;
}

// 로드맵 액션 추천 응답
export interface RoadmapActionRecommendResponse {
  recommendRoadmapActionList: string[];
}

// API 응답 래퍼 타입
export interface ApiResponse<T> {
  result: 'SUCCESS' | 'ERROR';
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

// 기존 UI용 타입 (하위 호환성 유지)
export interface RoadmapStep {
  id: number;
  name: string;
  position: { x: number; y: number };
  completed: boolean;
  progress?: number; // 진행도 (0-100)
}

export interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
}

export interface RoadmapChecklist {
  [key: number]: ChecklistItem[]; // Key is RoadmapStep.id
}

export interface CareerInfo {
  dDay: string;
  jobTitle: string;
  experience: string;
  careerDetails: string;
  targetPeriod: string;
}

export interface RoadmapData {
  steps: RoadmapStep[];
  careerInfo: CareerInfo;
  checklists: RoadmapChecklist;
}
