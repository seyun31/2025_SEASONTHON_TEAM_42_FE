export interface RoadmapResult {
  type: 'bot';
  message: string[];
  timestamp: number;
  isComplete: boolean;
}

export const roadmapResults: RoadmapResult[] = [
  {
    type: 'bot',
    message: [
      '준비 직업: 사회복지사 보조\n보유 경험/자격증: 노인 봉사활동 5년\n목표 취업 기간: 4개월 이내\n\n[1개월 이내] 준비하기\n• 추천 받은 직업의 주요 업무 검색해보기\n• 사회복지사 업무 영상 시청하기 (ex. 유튜브에서 사회복지사 브이로그 시청)\n• 맞춤형 추천 공고 3개 확인 → 우대사항 체크\n• 맞춤형 교육 프로그램 3개 확인\n• 온라인 사회복지 관련 단기 과정 수강 신청\n\n[1-2개월 차] 성장하기\n• 온라인 사회복지 관련 단기 과정 수강 시작\n• 구직 사이트 회원가입 및 기본 이력서 등록\n\n[2개월 차] 도전하기\n• 관심 있는 공고 2곳 지원\n• 지역 복지센터 채용 설명회 참석\n\n[3-4개월 차] 목표 달성하기\n• 이력서 보완 + 면접 준비\n• 1곳 이상 면접 진행',
    ],
    timestamp: Date.now(),
    isComplete: true,
  },
];
