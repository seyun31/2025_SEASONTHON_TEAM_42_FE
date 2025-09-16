import { RoadmapData } from '@/types/roadmap';

// 기본 로드맵 단계 데이터 (API 데이터가 없을 때 사용)
export const defaultRoadmapSteps = [
  { id: 1, name: '준비', completed: true },
  { id: 2, name: '성장', completed: true },
  { id: 3, name: '도전', completed: false },
  { id: 4, name: '달성', completed: false },
];

// 기본 취업 정보 (API 데이터가 없을 때 사용)
export const defaultCareerInfo = {
  dDay: 'D + 10',
  jobTitle: '사회복지사 보조',
  experience: '노인 봉사활동 5년',
  targetPeriod: '4개월 이내',
};

export const mockRoadmapData: RoadmapData = {
  steps: defaultRoadmapSteps.map((step, index) => ({
    ...step,
    position: { x: 12 + index * 20, y: 35 + index * 10 },
    progress: step.completed ? 100 : 0,
  })),
  careerInfo: {
    ...defaultCareerInfo,
    careerDetails: '엄청나게 긴 경력사항은 이렇게 처리합니다',
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
