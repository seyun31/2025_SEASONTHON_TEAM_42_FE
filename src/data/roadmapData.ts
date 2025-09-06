import { RoadmapData } from '@/types/roadmap';

export const mockRoadmapData: RoadmapData = {
  steps: [
    {
      id: 1,
      name: '준비',
      position: { x: 12, y: 35 },
      completed: true,
      progress: 100,
    },
    {
      id: 2,
      name: '성장',
      position: { x: 38, y: 70 },
      completed: true,
      progress: 100,
    },
    {
      id: 3,
      name: '도전',
      position: { x: 62, y: 30 },
      completed: false,
      progress: 60,
    },
    {
      id: 4,
      name: '달성',
      position: { x: 90, y: 5 },
      completed: false,
      progress: 0,
    },
  ],
  careerInfo: {
    dDay: 'D + 10',
    jobTitle: '사회복지사 보조',
    experience: '노인 봉사활동 5년',
    careerDetails: '엄청나게 긴 경력사항은 이렇게 처리합니다',
    targetPeriod: '4개월 이내',
  },
};
