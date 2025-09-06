export interface AICoachCard {
  id: string;
  title: string;
  subtitle: string;
  gradient: string;
  character: string;
}

export const aiCoachCards: AICoachCard[] = [
  {
    id: 'second-career',
    title: '제 2의 직업이 고민된다면?',
    subtitle: 'AI 코치에게 맞춤형 추천 받기!',
    gradient: 'from-orange-400 to-pink-400',
    character: '🌟',
  },
  {
    id: 'career-roadmap',
    title: '뭐부터 시작해야 할지 막막하다면?',
    subtitle: '땡땡이에게 취업 준비 로드맵 받아보기!',
    gradient: 'from-yellow-400 to-green-400',
    character: '⭐',
  },
];
