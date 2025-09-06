export interface ChatQuestion {
  id: number;
  step: number;
  type: 'text' | 'choice' | 'mixed';
  required: boolean;
  speaker: string;
  message: string[];
  options?: string[];
  placeholder?: string;
  canSkip?: boolean;
}

export interface ChatFlow {
  intro: {
    speaker: string;
    messages: string[];
    totalQuestions: number;
    requiredQuestions: number;
  };
  questions: ChatQuestion[];
  outro: {
    speaker: string;
    message: string[];
  };
}

export const createAiChatRoadmapFlow = (userName: string = '님'): ChatFlow => ({
  intro: {
    speaker: 'AI 코치',
    messages: [
      `안녕하세요 ${userName}! 🙌`,
      '지금부터 딱 맞는 커리어 로드맵을 만들어드릴게요.',
      '총 3가지만 여쭤볼게요. (금방 끝나요 ✨)',
    ],
    totalQuestions: 3,
    requiredQuestions: 3,
  },

  questions: [
    {
      id: 1,
      step: 1,
      type: 'text',
      required: true,
      speaker: 'AI 코치',
      message: [
        '먼저, 어떤 직업을 준비하고 싶으신가요?',
        '예: 요양보호사, 회계보조, 카페 매니저, 아직 잘 모르겠어요',
      ],
      canSkip: false,
    },

    {
      id: 2,
      step: 2,
      type: 'mixed',
      required: true,
      speaker: 'AI 코치',
      message: [
        '좋습니다 👍',
        '이번엔 지금까지 해오신 경험이나 자격증을 알려주세요.',
        '회사 경험은 물론, 주부·봉사·동호회 같은 것도 다 자산이 돼요.',
        '예: 컴퓨터활용 자격증, 간호보조사 자격증, 15년간 공장 생산 관리 / 10년 주부 + 요리 자격증 / 동네 모임 총무 등',
      ],
      options: [
        '조리사',
        '지게차 운전 자격증',
        '전기기사',
        '간호조무사',
        '사회복지사',
        '운전면허',
      ],
      canSkip: false,
    },

    {
      id: 3,
      step: 3,
      type: 'mixed',
      required: false,
      speaker: 'AI 코치',
      message: ['마지막이에요 🎉', '취업 목표 기간을 알려주세요.'],
      options: [
        '지금 당장',
        '1개월 준비',
        '1 ~ 2개월 준비',
        '3 ~ 4개월 준비',
        '4 ~ 6개월 준비',
        '6개월 이상',
        '상관 없음',
      ],
      canSkip: false,
    },
  ],

  outro: {
    speaker: 'AI 코치',
    message: [
      `수고 많으셨어요 ${userName}! 🙏`,
      `말씀해주신 내용을 토대로 ${userName}께 딱 맞는`,
      '단계별 취업 준비 로드맵을 완성해드릴게요 🚀',
    ],
  },
});
