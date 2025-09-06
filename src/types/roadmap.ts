export interface RoadmapStep {
  id: number;
  name: string;
  position: { x: number; y: number };
  completed: boolean;
  progress?: number; // 진행도 (0-100)
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
}
