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
  outro: {
    speaker: string;
    message: string[];
  };
}

export const aiChatFlow: ChatFlow = {
  intro: {
    speaker: 'AI 코치',
    messages: [
      '안녕하세요 세윤님! 반가워요 🙌',
      '저는 세윤님만의 맞춤형 AI 코치 (캐릭터 명)이에요!',
      '저랑 잠깐 대화만 하시면, 세윤님께 딱 맞는 직업을 3개 추천해드릴게요.',
      '질문은 총 9개입니다 (필수 질문 3개, 선택 질문 6개)',
      '그럼 시작해볼까요!',
    ],
    totalQuestions: 9,
    requiredQuestions: 3,
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
        '먼저, 지금까지 어떤 일을 해오셨는지 알려주세요.',
        '꼭 회사 일이 아니어도 좋아요. 가정·봉사·동호회 같은 경험도 다 경력이에요.',
        '👉 이 답변으로 "어떤 경험을 강점으로 바꿀 수 있을지" 찾아드려요.',
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
        '가지고 계신 자격증이나 특별히 잘한다고 생각하는 기술이 있다면 알려주세요 ✍️',
        '운전면허처럼 생활 속 자격증도 좋고, 컴퓨터·요리·안전관리 같은 기술도 좋아요.',
        '👉 이걸 알려주시면, "자격증이 필요한 일자리"를 바로 보여드릴 수 있어요.',
      ],
      canSkip: false,
    },

    {
      id: 3,
      step: 3,
      type: 'mixed',
      required: true,
      speaker: 'AI 코치',
      message: [
        '일할 때 어떤 스타일이 편하세요?',
        '👉 "성향에 맞는 일자리"를 찾는 데 도움이 돼요.',
      ],
      options: [
        '혼자서',
        '여럿이서',
        '책상에 앉아서',
        '몸을 움직이며',
        '예술, 창의적인',
        '누군가를 돕는',
        '고객 응대',
        '정해진 규칙 안에서 체계적인',
        '잘 모르겠어요',
      ],
      canSkip: false,
    },

    {
      id: 4,
      step: 4,
      type: 'mixed',
      required: false,
      speaker: 'AI 코치',
      message: [
        '반대로, "이건 좀 피하고 싶다" 싶은 일이 있나요?',
        '👉 미리 알려주시면 추천할 때 걸러드릴게요 🙂',
      ],
      options: [
        '사람을 많이 만나야 하는 일',
        '무거운 물건을 들어야 하는 일',
        '늦은 시간이나 주말에 해야 하는 일',
        '책임이 너무 무거운 일',
        '잘 모르겠어요',
      ],
      canSkip: true,
    },

    {
      id: 5,
      step: 5,
      type: 'mixed',
      required: false,
      speaker: 'AI 코치',
      message: [
        '주변에서 자주 듣는 칭찬이나 성격을 선택해주세요!',
        '👉 "성격에 맞는 직업"을 찾는 데 큰 힌트가 돼요.',
        '(보기에 없다면 채팅으로 보내주세요! 😊)',
      ],
      options: [
        '꼼꼼하다, 추진력이 있다',
        '손재주가 좋다',
        '차분하다',
        '사람들 얘기를 잘 들어준다',
        '책임감이 강하다',
      ],
      canSkip: true,
    },

    {
      id: 6,
      step: 6,
      type: 'mixed',
      required: false,
      speaker: 'AI 코치',
      message: [
        '요즘 관심 있는 분야가 있으신가요?',
        '👉 좋아하는 분야를 선택하면, "관심사 기반 직업"을 추천해드려요.',
      ],
      options: [
        '사람 돌보는 일 (아이, 노인 등)',
        '손으로 만드는 일 (요리, 공예, 꽃, 그림 등)',
        '글쓰기·말하기·책 읽기',
        '자연·식물·반려동물',
        '기술·디지털 기기',
        '문화예술·콘텐츠',
        '아직 잘 모르겠어요',
      ],
      canSkip: true,
    },

    {
      id: 7,
      step: 7,
      type: 'mixed',
      required: false,
      speaker: 'AI 코치',
      message: [
        '근무 시간이나 방식은 어떻게 원하시나요? ⏰',
        '👉 원하는 근무 조건에 맞는 채용만 보여드릴 수 있어요.',
        '(보기에 없다면 채팅으로 보내주세요! 😊)',
      ],
      options: [
        '정해진 시간에',
        '오전만',
        '오후만',
        '하루 몇 시간만 짧게',
        '평일만 근무',
        '밤에도 괜찮아요',
        '가까운 곳에서',
        '멀어도 괜찮아요',
      ],
      canSkip: true,
    },

    {
      id: 8,
      step: 8,
      type: 'choice',
      required: false,
      speaker: 'AI 코치',
      message: [
        '체력은 어느 정도이신가요? 💪',
        '👉 체력 조건에 맞는 일을 추천할 때 중요해요.',
      ],
      options: [
        '활동적인 편이에요',
        '보통이에요',
        '오래 서 있거나 무거운 건 조금 힘들어요',
      ],
      canSkip: true,
    },

    {
      id: 9,
      step: 9,
      type: 'choice',
      required: false,
      speaker: 'AI 코치',
      message: [
        '이제 마지막이에요! 🎉',
        '교육 수강이나 자격증 취득이 필요한 직무도 괜찮으신가요?',
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

  outro: {
    speaker: 'AI 코치',
    message: [
      '수고 많으셨어요 세윤님! 🙏',
      '말씀해주신 내용을 토대로 세윤님께 딱 맞는',
      '직업 3개를 추천해드릴게요 🚀',
    ],
  },
};
