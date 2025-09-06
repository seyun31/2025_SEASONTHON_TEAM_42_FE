export interface RoadmapResult {
  type: 'bot';
  message: string[];
  timestamp: number;
  isComplete: boolean;
}

interface RoadmapStep {
  period: string;
  category: string;
  isCompleted: boolean;
  actions: Array<{
    action: string;
    isCompleted: boolean;
  }>;
}

interface RoadmapData {
  steps: RoadmapStep[];
}

export const createRoadmapResults = (
  career: string,
  experience: string,
  period: string,
  roadmapData?: RoadmapData
): RoadmapResult[] => {
  let roadmapContent = `준비 직업: ${career}\n보유 경험/자격증: ${experience}\n목표 취업 기간: ${period}\n\n`;

  if (roadmapData && roadmapData.steps) {
    roadmapData.steps.forEach((step) => {
      roadmapContent += `[${step.period}] ${step.category}\n`;
      if (step.actions && step.actions.length > 0) {
        step.actions.forEach((action) => {
          roadmapContent += `• ${action.action}\n`;
        });
      }
      roadmapContent += '\n';
    });
  }

  return [
    {
      type: 'bot',
      message: [roadmapContent.trim()],
      timestamp: Date.now(),
      isComplete: true,
    },
  ];
};
