// 통합된 전체 데이터 형식
export interface JobSummary {
  id: number;
  jobId: string;
  companyName: string;
  companyLogo: string;
  jobTitle: string;
  jobCategory: string;
  workLocation: string;
  employmentType: string;
  salary: string;
  workPeriod: string;
  experience: string;
  requiredSkills: string;
  preferredSkills: string;
  postingDate: string;
  closingDate: string;
  applyLink: string;
  jobRecommendScore: number | null;
  isScrap: boolean;
}

// 기존 호환성을 위한 별칭
export type JobDetail = JobSummary;

// API 응답 타입 정의
export interface ApiResponse<T> {
  result: 'SUCCESS' | 'ERROR';
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

// 전체 채용 조회 API 응답 타입
export interface AllResponse {
  jobId: number;
  companyName: string;
  companyLogo: string;
  jobTitle: string;
  jobCategory: string;
  workLocation: string;
  employmentType: string;
  salary: string;
  workPeriod: string;
  experience: string;
  requiredSkills: string;
  preferredSkills: string;
  postingDate: string;
  closingDate: string;
  applyLink: string;
  imageUrl: string;
  jobRecommendScore: number | null;
  isBookmark: boolean;
}

export interface SearchAllResponse {
  totalElements: number;
  numberOfElements: number;
  jobDtoList: AllResponse[];
}

// 맞춤형 일자리 추천 API 응답 타입
export interface JobResponse {
  jobId: string;
  companyName: string;
  keyword: string;
  jobRecommendScore: string;
  closingDate: string;
  workLocation: string;
  imageUrl: string;
  isBookmark: boolean;
}
