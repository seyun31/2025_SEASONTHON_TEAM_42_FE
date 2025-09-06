import { create } from 'zustand';

interface RoadmapState {
  hasRoadmap: boolean;
  setHasRoadmap: (hasRoadmap: boolean) => void;
}

export const useRoadmapStore = create<RoadmapState>((set) => ({
  hasRoadmap: true, // 개발용: 로드맵 생성된 상태로 설정
  setHasRoadmap: (hasRoadmap) => set({ hasRoadmap }),
}));
