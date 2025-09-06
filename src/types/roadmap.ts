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
