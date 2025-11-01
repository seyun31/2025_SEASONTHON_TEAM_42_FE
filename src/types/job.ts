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
  requiredDocuments?: string;
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

// 교육 DTO 타입 정의
export interface EducationDto {
  trprId: number;
  educationId: number;
  title: string;
  subTitle: string;
  traStartDate: string;
  traEndDate: string;
  address: string;
  courseMan: string;
  keyword1: string;
  keyword2: string;
  trprDegr: string;
  imageUrl: string;
  titleLink: string;
  isBookmark: boolean;
  score: number | null;
}

// 전체 채용 조회 API 응답 타입
export interface AllResponse {
  jobId: number;
  companyName: string;
  jobCodeName: string;
  recruitNumber: number;
  employmentType: string;
  workLocation: string;
  description: string;
  wage: string;
  insurance: string;
  workTime: string;
  managerPhone: string;
  jobTitle: string;
  screeningMethod: string;
  receptionMethod: string;
  requiredDocuments: string;
  jobCategory: string;
  postingDate: string;
  closingDate: string;
  imageUrl: string;
  isBookmark: boolean;
  score: number;
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

// 단건 채용 조회 API 응답 타입 (스웨거 Response 스키마)
export interface JobDetailResponse {
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
  requiredDocuments?: string;
  isScrap: boolean;
}

// 직업 추천 API 응답 타입
export interface Occupation {
  imageUrl: string;
  occupationName: string;
  description: string;
  strength: string;
  workCondition: string;
  wish: string;
  score: string;
}

export interface RecommendJob {
  first: Occupation;
  second: Occupation;
  third: Occupation;
}

// 북마크 관련 타입
export interface MemberJobMap {
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
  id: number;
  memberId: number;
  jobId: number;
}

// AI 채팅 옵션 응답 타입
export interface OptionResponse {
  optionList: string[];
}

// AI 채팅 히스토리 응답 타입
export interface HistoryResponse {
  experience: string;
  certificateOrSkill: string;
  personalityType: string;
  interests: string;
  preferredWorkStyles: string;
  avoidConditions: string;
  availableWorkingTime: string;
  physicalCondition: string;
  educationAndCareerGoal: string;
}

// HRD 과정 관련 타입
export interface CardCourseItem {
  eiEmplCnt3Gt10: string;
  eiEmplRate6: string;
  eiEmplCnt3: string;
  eiEmplRate3: string;
  certificate: string;
  title: string;
  realMan: string;
  telNo: string;
  stdgScor: string;
  traStartDate: string;
  grade: string;
  ncsCd: string;
  regCourseMan: string;
  trprDegr: string;
  address: string;
  traEndDate: string;
  subTitle: string;
  instCd: string;
  trngAreaCd: string;
  trprId: string;
  yardMan: string;
  courseMan: string;
  trainTarget: string;
  trainTargetCd: string;
  trainstCstId: string;
  contents: string;
  subTitleLink: string;
  titleLink: string;
  titleIcon: string;
}

export interface CardCoursePage {
  pageNum: number;
  pageSize: number;
  scn_cnt: number;
  srchList: CardCourseItem[];
}

// Education 관련 타입 정의
export interface EducationSummary {
  id: string;
  educationId?: number;
  trprId: string;
  title: string;
  subTitle: string;
  institution: string;
  address: string;
  traStartDate: string;
  traEndDate: string;
  trainTarget: string;
  contents: string;
  certificate: string;
  grade: string;
  regCourseMan: string;
  courseMan: string;
  realMan: string;
  yardMan: string;
  telNo: string;
  stdgScor: string;
  eiEmplCnt3: string;
  eiEmplRate3: string;
  eiEmplCnt3Gt10: string;
  eiEmplRate6: string;
  ncsCd: string;
  trprDegr: string;
  instCd: string;
  trngAreaCd: string;
  trainTargetCd: string;
  trainstCstId: string;
  subTitleLink: string;
  titleLink: string;
  titleIcon: string;
  imageUrl?: string;
  isBookmark?: boolean;
  recommendScore?: number;
}

// Education API 응답 타입 (HRD Course)
export interface EducationApiResponse {
  result: 'SUCCESS' | 'ERROR';
  data: {
    pageNum: number;
    pageSize: number;
    scn_cnt: number;
    srchList: CardCourseItem[];
  };
  error?: {
    code: string;
    message: string;
  };
}

// Education API 응답 타입 (교육 데이터)
export interface EducationDataResponse {
  result: 'SUCCESS' | 'ERROR';
  data: {
    totalElements: number;
    numberOfElements: number;
    educationDtoList: EducationDto[];
  };
  error?: {
    code: string;
    message: string;
  };
}
