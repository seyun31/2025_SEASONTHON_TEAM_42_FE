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
  jobRecommendScore: number;
  isScrap: boolean;
}

// 기존 호환성을 위한 별칭
export type JobDetail = JobSummary;
