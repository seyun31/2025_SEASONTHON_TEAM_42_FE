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
    optionalQuestions: number;
  };
  questions: ChatQuestion[];
}

export const createAiChatFlow = (userName: string = '님'): ChatFlow => ({
  intro: {
    speaker: 'AI 코치',
    messages: [
      `안녕하세요 ${userName}! 반가워요 🙌`,
      `저는 ${userName}만의 맞춤형 AI 코치 꿈별이에요!`,
      `질문에 답을 해주시면 강점 리포트와 맞춤형 직업 추천을 해드려요!`,
      '질문은 총 10개입니다 (필수 질문 4개 / 선택 질문 6개)',
      '그럼 시작해볼까요!',
    ],
    totalQuestions: 10,
    requiredQuestions: 4,
    optionalQuestions: 6,
  },

  questions: [
    {
      id: 1,
      step: 1,
      type: 'text',
      required: true,
      speaker: 'AI 코치',
      message: [
        '**[직업 경력]**',
        '지금까지 어떤 일을 해오셨나요?',
        '예시: “20년 동안 경찰로 근무했습니다. 주로 사건 조사, 민원 응대, 순찰 업무를 했어요.”',
      ],
      canSkip: false,
    },

    {
      id: 2,
      step: 2,
      type: 'text',
      required: true,
      speaker: 'AI 코치',
      message: [
        '**[직업 외 경험]**',
        '직업 외에 특별한 경험이 있으신가요?',
        '예시: “동네 모임 총무로 4년 간 활동”, “복지센터에서 어르신 돌봄 봉사 활동”, “10년 차 주부”, “지역 행사 요원”',
      ],
      canSkip: false,
    },

    {
      id: 3,
      step: 3,
      type: 'text',
      required: true,
      speaker: 'AI 코치',
      message: [
        '**[자격증·기술]**',
        '자격증이나 특별히 자신 있는 기술이 있으신가요?',
        '예: 요양보호사 자격증, 컴퓨터 활용능력 2급, 한식조리사, 지게차 운전, 주부 9단 등',
      ],
      options: [],
      canSkip: false,
    },

    {
      id: 4,
      step: 4,
      type: 'mixed',
      required: false,
      speaker: 'AI 코치',
      message: [
        '**[원하는 일 스타일]**',
        '앞으로는 어떤 스타일의 일을 하고 싶으신가요?',
        '예: “사람들을 돕고, 제 경험을 나눌 수 있는 일이면 좋겠습니다.”',
      ],
      options: [],
      canSkip: false,
    },

    {
      id: 5,
      step: 5,
      type: 'mixed',
      required: false,
      speaker: 'AI 코치',
      message: [
        '**[피하고 싶은 일]**',
        '반대로, “이건 좀 피하고 싶다” 하는 일이 있으신가요?',
        '예: 사람을 많이 만나야 하는 일, 무거운 물건을 들어야 하는 일, 늦은 시간이나 주말에 해야 하는 일',
      ],
      options: [],
      canSkip: true,
    },

    {
      id: 6,
      step: 6,
      type: 'mixed',
      required: false,
      speaker: 'AI 코치',
      message: [
        '**[성격·성향]**',
        '주변에서 자주 듣는 칭찬이나 성격을 선택해주세요!',
        '예: 꼼꼼하다, 추진력이 있다, 손재주가 좋다',
      ],
      options: [],
      canSkip: true,
    },

    {
      id: 7,
      step: 7,
      type: 'mixed',
      required: false,
      speaker: 'AI 코치',
      message: [
        '**[관심 분야]**',
        '요즘 관심 있는 분야가 있으신가요?',
        '예: 사람 돌보는 일 (아이, 노인 등), 손으로 만드는 일 (요리, 공예, 꽃, 그림 등), 글쓰기·말하기·책 읽기',
      ],
      options: [],
      canSkip: true,
    },

    {
      id: 8,
      step: 8,
      type: 'mixed',
      required: false,
      speaker: 'AI 코치',
      message: [
        '**[근무 시간·방식]**',
        '근무 시간이나 방식은 어떤 형태를 원하시나요? ⏰',
      ],
      options: [
        '정해진 시간에',
        '오전만',
        '오후만',
        '하루 몇 시간만 짧게',
        '평일만',
        '밤에도 괜찮아요',
        '집 근처에서만',
        '멀어도 괜찮아요',
      ],
      canSkip: true,
    },

    {
      id: 9,
      step: 9,
      type: 'choice',
      required: false,
      speaker: 'AI 코치',
      message: ['**[체력 상태]**', '체력은 어느 정도이신가요? 💪'],
      options: [
        '활동적인 편이에요',
        '보통이에요',
        '오래 서 있거나 무거운 건 조금 힘들어요',
      ],
      canSkip: true,
    },

    {
      id: 10,
      step: 10,
      type: 'choice',
      required: false,
      speaker: 'AI 코치',
      message: [
        '**[교육·취업 목표]**',
        '마지막 질문이에요! 🎉',
        '새로운 일을 위해 교육이나 자격증 준비가 필요하다면 괜찮으신가요?',
        '그리고 취업은 언제쯤 하고 싶으신가요?',
      ],
      options: [
        '교육/자격증: 예',
        '교육/자격증: 아니오',
        '교육/자격증: 상황에 따라',
        '취업 목표: 지금 당장 원해요',
        '취업 목표: 1~2달 정도 준비해도 괜찮아요',
        '취업 목표: 3~6달 준비해도 괜찮아요',
        '취업 목표: 상황에 따라',
      ],
      canSkip: true,
    },
  ],
});
