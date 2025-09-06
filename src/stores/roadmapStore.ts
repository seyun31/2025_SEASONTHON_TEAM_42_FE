import { create } from 'zustand';

interface RoadmapState {
  hasRoadmap: boolean;
  setHasRoadmap: (hasRoadmap: boolean) => void;
}

export const useRoadmapStore = create<RoadmapState>((set) => ({
  hasRoadmap: false,
  setHasRoadmap: (hasRoadmap) => set({ hasRoadmap }),
}));
