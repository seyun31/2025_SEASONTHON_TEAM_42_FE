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
  checklists: {
    1: [
      // 준비 단계
      {
        id: 1,
        text: '사회복지사 보조 주요 업무 검색해보기',
        completed: true,
      },
      {
        id: 2,
        text: '사회복지사 업무 영상 시청하기 (ex. 유튜브에서 사회복지사 브이로그 시청)',
        completed: true,
      },
      {
        id: 3,
        text: '맞춤형 추천 공고 3개 확인 및 우대사항 체크하기',
        completed: false,
      },
      {
        id: 4,
        text: '맞춤형 교육 프로그램 3개 확인하기',
        completed: false,
      },
    ],
    2: [
      // 성장 단계
      {
        id: 5,
        text: '사회복지사 자격증 취득 계획 수립하기',
        completed: true,
      },
      {
        id: 6,
        text: '관련 전문서적 3권 이상 읽기',
        completed: true,
      },
      {
        id: 7,
        text: '온라인 강의 수강하기 (사회복지학 개론)',
        completed: false,
      },
      {
        id: 8,
        text: '실무 경험 쌓기 (봉사활동 확대)',
        completed: false,
      },
    ],
    3: [
      // 도전 단계
      {
        id: 9,
        text: '이력서 및 자기소개서 작성하기',
        completed: false,
      },
      {
        id: 10,
        text: '포트폴리오 준비하기',
        completed: false,
      },
      {
        id: 11,
        text: '면접 준비 및 모의면접 실시하기',
        completed: false,
      },
      {
        id: 12,
        text: '취업 정보 사이트 정기적으로 확인하기',
        completed: false,
      },
    ],
    4: [
      // 달성 단계
      {
        id: 13,
        text: '최종 면접 합격하기',
        completed: false,
      },
      {
        id: 14,
        text: '입사 준비 및 서류 제출하기',
        completed: false,
      },
      {
        id: 15,
        text: '첫 출근 및 업무 적응하기',
        completed: false,
      },
      {
        id: 16,
        text: '장기 커리어 계획 수립하기',
        completed: false,
      },
    ],
  },
};
