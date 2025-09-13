export interface EducationRecommendation {
  id: string;
  institutionLogo: string;
  institutionName: string;
  location: string;
  duration: string;
  cost: string;
  description: string;
  deadline: string;
  isFavorited?: boolean;
}

export const educationRecommendations: EducationRecommendation[] = [
  {
    id: 'education-1',
    institutionLogo: '기업로고',
    institutionName: '교육기관명',
    location: '서울시 동대문구',
    duration: '2025.09.01 - 2025.12.01',
    cost: '1,000,000 원',
    description: '국회의원은 국가이익을 우선하여 양심에 따라 직무를 행한다.',
    deadline: 'D-34',
    isFavorited: false,
  },
  {
    id: 'education-2',
    institutionLogo: '기업로고',
    institutionName: '교육기관명',
    location: '서울시 동대문구',
    duration: '2025.09.01 - 2025.12.01',
    cost: '1,000,000 원',
    description: '국회의원은 국가이익을 우선하여 양심에 따라 직무를 행한다.',
    deadline: 'D-34',
    isFavorited: false,
  },
  {
    id: 'education-3',
    institutionLogo: '기업로고',
    institutionName: '교육기관명',
    location: '서울시 동대문구',
    duration: '2025.09.01 - 2025.12.01',
    cost: '1,000,000 원',
    description: '국회의원은 국가이익을 우선하여 양심에 따라 직무를 행한다.',
    deadline: 'D-34',
    isFavorited: false,
  },
  {
    id: 'education-4',
    institutionLogo: '기업로고',
    institutionName: '교육기관명',
    location: '서울시 동대문구',
    duration: '2025.09.01 - 2025.12.01',
    cost: '1,000,000 원',
    description: '국회의원은 국가이익을 우선하여 양심에 따라 직무를 행한다.',
    deadline: 'D-34',
    isFavorited: false,
  },
];
