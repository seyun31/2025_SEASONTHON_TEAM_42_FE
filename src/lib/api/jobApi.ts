import {
  JobSummary,
  JobDetail,
  ApiResponse,
  SearchAllResponse,
  AllResponse,
  JobDetailResponse,
  RecommendJob,
  MemberJobMap,
  OptionResponse,
  HistoryResponse,
  CardCoursePage,
  EducationSummary,
  EducationApiResponse,
  EducationDataResponse,
  CardCourseItem,
  EducationDto,
} from '@/types/job';
import {
  RoadMapResponse,
  RoadMapRequest,
  ActionUpdateRequest,
  RoadmapActionRecommendResponse,
  ApiResponse as RoadmapApiResponse,
} from '@/types/roadmap';
import { getAccessToken } from '@/lib/auth';

// 전체 채용공고 목록 조회
export const getJobList = async (): Promise<JobSummary[]> => {
  try {
    const response = await fetch('/api/jobs');
    if (!response.ok) {
      throw new Error('Failed to fetch job list');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching job list:', error);
    throw error;
  }
};

// 특정 채용공고 상세 조회
export const getJobDetail = async (jobId: string): Promise<JobDetail> => {
  try {
    const response = await fetch(`/api/jobs/${jobId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch job detail');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching job detail:', error);
    throw error;
  }
};

// 스크랩 토글
export const toggleJobScrap = async (jobId: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/jobs/${jobId}/scrap`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to toggle job scrap');
    }
    const result = await response.json();
    return result.isScrap;
  } catch (error) {
    console.error('Error toggling job scrap:', error);
    throw error;
  }
};

// 맞춤형 일자리 추천 (로그인 시)
export const getRecommendedJobs = async (): Promise<AllResponse[]> => {
  try {
    console.log('Making API request to /api/job/recommend');

    const response = await fetch('/api/job/recommend', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // HttpOnly 쿠키 포함
    });

    console.log('getRecommendedJobs - API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('getRecommendedJobs - API Error Response:', errorText);
      throw new Error(
        `Failed to fetch recommended jobs: ${response.status} ${response.statusText}`
      );
    }

    const result: ApiResponse<SearchAllResponse> = await response.json();
    console.log('getRecommendedJobs - API Response data:', result);

    if (result.result !== 'SUCCESS') {
      console.error('getRecommendedJobs - API returned error:', result.error);
      throw new Error(result.error?.message || 'API request failed');
    }

    console.log('getRecommendedJobs - jobDtoList:', result.data.jobDtoList);
    return result.data.jobDtoList || [];
  } catch (error) {
    console.error('Error fetching recommended jobs:', error);
    throw error;
  }
};

// 전체 채용 조회 (비로그인 시)
export const getAllJobs = async (filters?: {
  keyword?: string;
  page?: number;
  size?: number;
  workLocation?: string[];
  employmentType?: string[];
  jobCategory?: string[];
}): Promise<SearchAllResponse> => {
  try {
    console.log('Making API request to /job/all/anonymous');

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      throw new Error(
        'NEXT_PUBLIC_BACKEND_URL 환경변수가 설정되지 않았습니다.'
      );
    }

    // 쿼리 파라미터 생성
    const queryParams = new URLSearchParams();

    if (filters?.keyword) {
      queryParams.append('keyword', filters.keyword);
    }

    if (filters?.page !== undefined) {
      queryParams.append('page', filters.page.toString());
    }

    if (filters?.size !== undefined) {
      queryParams.append('size', filters.size.toString());
    }

    if (filters?.workLocation && filters.workLocation.length > 0) {
      filters.workLocation.forEach((location) => {
        queryParams.append('workLocation', location);
      });
    }

    if (filters?.employmentType && filters.employmentType.length > 0) {
      filters.employmentType.forEach((type) => {
        queryParams.append('employmentType', type);
      });
    }

    if (filters?.jobCategory && filters.jobCategory.length > 0) {
      filters.jobCategory.forEach((category) => {
        queryParams.append('jobCategory', category);
      });
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `${backendUrl}/job/all/anonymous?${queryString}`
      : `${backendUrl}/job/all/anonymous`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(
        `Failed to fetch all jobs: ${response.status} ${response.statusText}`
      );
    }

    const result: ApiResponse<SearchAllResponse> = await response.json();

    if (result.result !== 'SUCCESS') {
      throw new Error(result.error?.message || 'API request failed');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    throw error;
  }
};

// 전체 채용 조회 (로그인 시)
export const getAllJobsForLoggedIn = async (filters?: {
  keyword?: string;
  page?: number;
  size?: number;
  workLocation?: string[];
  employmentType?: string[];
  jobCategory?: string[];
}): Promise<SearchAllResponse> => {
  try {
    console.log('Making API request to /api/job/all');

    // 쿼리 파라미터 생성
    const queryParams = new URLSearchParams();

    if (filters?.keyword) {
      queryParams.append('keyword', filters.keyword);
    }

    if (filters?.page !== undefined) {
      queryParams.append('page', filters.page.toString());
    }

    if (filters?.size !== undefined) {
      queryParams.append('size', filters.size.toString());
    }

    if (filters?.workLocation && filters.workLocation.length > 0) {
      filters.workLocation.forEach((location) => {
        queryParams.append('workLocation', location);
      });
    }

    if (filters?.employmentType && filters.employmentType.length > 0) {
      filters.employmentType.forEach((type) => {
        queryParams.append('employmentType', type);
      });
    }

    if (filters?.jobCategory && filters.jobCategory.length > 0) {
      filters.jobCategory.forEach((category) => {
        queryParams.append('jobCategory', category);
      });
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/api/job/all?${queryString}` : `/api/job/all`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // HttpOnly 쿠키 포함
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(
        `Failed to fetch all jobs: ${response.status} ${response.statusText}`
      );
    }

    const result: ApiResponse<SearchAllResponse> = await response.json();

    if (result.result !== 'SUCCESS') {
      throw new Error(result.error?.message || 'API request failed');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching all jobs for logged in user:', error);
    throw error;
  }
};

// 로드맵 조회
export const getRoadMap = async (): Promise<RoadMapResponse> => {
  try {
    console.log('Making API request to /api/roadmap/recommend (GET)');

    const response = await fetch('/api/roadmap/recommend', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      credentials: 'include', // HttpOnly 쿠키 포함
    });

    console.log('getRoadMap - API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('getRoadMap - API Error Response:', errorText);
      throw new Error(
        `Failed to fetch roadmap: ${response.status} ${response.statusText}`
      );
    }

    const result: RoadmapApiResponse<RoadMapResponse> = await response.json();
    console.log('getRoadMap - API Response data:', result);

    if (result.result !== 'SUCCESS') {
      console.error('getRoadMap - API returned error:', result.error);
      throw new Error(result.error?.message || 'API request failed');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    throw error;
  }
};

// 맞춤형 로드맵 추천
export const recommendRoadMap = async (
  request: RoadMapRequest
): Promise<RoadMapResponse> => {
  try {
    console.log('Making API request to /api/roadmap/recommend (POST)');
    console.log('Request body:', request);

    const response = await fetch('/api/roadmap/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // HttpOnly 쿠키 포함
      body: JSON.stringify(request),
    });

    console.log('recommendRoadMap - API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('recommendRoadMap - API Error Response:', errorText);
      throw new Error(
        `Failed to recommend roadmap: ${response.status} ${response.statusText}`
      );
    }

    const result: RoadmapApiResponse<RoadMapResponse> = await response.json();
    console.log('recommendRoadMap - API Response data:', result);

    if (result.result !== 'SUCCESS') {
      console.error('recommendRoadMap - API returned error:', result.error);
      throw new Error(result.error?.message || 'API request failed');
    }

    return result.data;
  } catch (error) {
    console.error('Error recommending roadmap:', error);
    throw error;
  }
};

// 로드맵 액션 완료/미완료 토글
export const toggleRoadMapAction = async (
  roadMapActionId: number
): Promise<void> => {
  try {
    console.log(`Making API request to /api/roadmap/${roadMapActionId} (POST)`);

    const response = await fetch(`/api/roadmap/${roadMapActionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // HttpOnly 쿠키 포함
    });

    console.log('toggleRoadMapAction - API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('toggleRoadMapAction - API Error Response:', errorText);
      throw new Error(
        `Failed to toggle roadmap action: ${response.status} ${response.statusText}`
      );
    }

    const result: RoadmapApiResponse<object> = await response.json();
    console.log('toggleRoadMapAction - API Response data:', result);

    if (result.result !== 'SUCCESS') {
      console.error('toggleRoadMapAction - API returned error:', result.error);
      throw new Error(result.error?.message || 'API request failed');
    }
  } catch (error) {
    console.error('Error toggling roadmap action:', error);
    throw error;
  }
};

// 단건 채용 조회
export const getJobDetailById = async (
  jobId: number
): Promise<JobDetailResponse> => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error(
        'NEXT_PUBLIC_BACKEND_URL 환경변수가 설정되지 않았습니다.'
      );
    }

    const response = await fetch(`${backendUrl}/job/${jobId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(
        `Failed to fetch job detail: ${response.status} ${response.statusText}`
      );
    }

    const result: ApiResponse<JobDetailResponse> = await response.json();

    if (result.result !== 'SUCCESS') {
      throw new Error(result.error?.message || 'API request failed');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching job detail:', error);
    throw error;
  }
};

// 맞춤형 직업 추천
export const getRecommendedOccupations = async (): Promise<RecommendJob> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Access token not found');
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error(
        'NEXT_PUBLIC_BACKEND_URL 환경변수가 설정되지 않았습니다.'
      );
    }

    const response = await fetch(`${backendUrl}/job/recommend/occupation`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(
        `Failed to fetch recommended occupations: ${response.status} ${response.statusText}`
      );
    }

    const result: ApiResponse<RecommendJob> = await response.json();

    if (result.result !== 'SUCCESS') {
      throw new Error(result.error?.message || 'API request failed');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching recommended occupations:', error);
    throw error;
  }
};

// 북마크 등록
export const bookmarkJob = async (jobId: number): Promise<MemberJobMap[]> => {
  try {
    const response = await fetch(`/api/bookmark?jobId=${jobId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // HttpOnly 쿠키 포함
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(
        `Failed to bookmark job: ${response.status} ${response.statusText}`
      );
    }

    const result: ApiResponse<MemberJobMap[]> = await response.json();

    if (result.result !== 'SUCCESS') {
      throw new Error(result.error?.message || 'API request failed');
    }

    return result.data;
  } catch (error) {
    console.error('Error bookmarking job:', error);
    throw error;
  }
};

// 북마크 취소
export const cancelBookmark = async (
  jobId: number
): Promise<MemberJobMap[]> => {
  try {
    const response = await fetch(`/api/bookmark?jobId=${jobId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // HttpOnly 쿠키 포함
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(
        `Failed to cancel bookmark: ${response.status} ${response.statusText}`
      );
    }

    const result: ApiResponse<MemberJobMap[]> = await response.json();

    if (result.result !== 'SUCCESS') {
      throw new Error(result.error?.message || 'API request failed');
    }

    return result.data;
  } catch (error) {
    console.error('Error canceling bookmark:', error);
    throw error;
  }
};

// 북마크된 채용 공고 조회
export const getBookmarkedJobs = async (filters?: {
  keyword?: string;
  workLocation?: string;
  employmentType?: string;
  jobCategory?: string;
}): Promise<AllResponse[]> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Access token not found');
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error(
        'NEXT_PUBLIC_BACKEND_URL 환경변수가 설정되지 않았습니다.'
      );
    }

    // 쿼리 파라미터 생성
    const queryParams = new URLSearchParams();

    if (filters?.keyword) {
      queryParams.append('keyword', filters.keyword);
    }

    if (filters?.workLocation) {
      queryParams.append('workLocation', filters.workLocation);
    }

    if (filters?.employmentType) {
      queryParams.append('employmentType', filters.employmentType);
    }

    if (filters?.jobCategory) {
      queryParams.append('jobCategory', filters.jobCategory);
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `${backendUrl}/job/bookmarks?${queryString}`
      : `${backendUrl}/job/bookmarks`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(
        `Failed to fetch bookmarked jobs: ${response.status} ${response.statusText}`
      );
    }

    const result: ApiResponse<SearchAllResponse> = await response.json();

    if (result.result !== 'SUCCESS') {
      throw new Error(result.error?.message || 'API request failed');
    }

    return result.data.jobDtoList || [];
  } catch (error) {
    console.error('Error fetching bookmarked jobs:', error);
    throw error;
  }
};

// HRD 과정 조회
export const getHrdCourses = async (filters?: {
  keyword?: string;
  pageNo?: number;
  pageSize?: number;
  startYmd?: string;
  endYmd?: string;
}): Promise<CardCoursePage> => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error(
        'NEXT_PUBLIC_BACKEND_URL 환경변수가 설정되지 않았습니다.'
      );
    }

    // 쿼리 파라미터 생성
    const queryParams = new URLSearchParams();

    if (filters?.keyword) {
      queryParams.append('keyword', filters.keyword);
    }

    if (filters?.pageNo !== undefined) {
      queryParams.append('page', filters.pageNo.toString());
    }

    if (filters?.pageSize !== undefined) {
      queryParams.append('size', filters.pageSize.toString());
    }

    if (filters?.startYmd) {
      queryParams.append('startYmd', filters.startYmd);
    }

    if (filters?.endYmd) {
      queryParams.append('endYmd', filters.endYmd);
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `${backendUrl}/job/hrd-course?${queryString}`
      : `${backendUrl}/job/hrd-course`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(
        `Failed to fetch HRD courses: ${response.status} ${response.statusText}`
      );
    }

    const result: ApiResponse<CardCoursePage> = await response.json();

    if (result.result !== 'SUCCESS') {
      throw new Error(result.error?.message || 'API request failed');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching HRD courses:', error);
    throw error;
  }
};

// 로드맵 액션 수정
export const updateRoadmapAction = async (
  roadMapActionId: number,
  action: string
): Promise<void> => {
  try {
    const requestBody: ActionUpdateRequest = { action };

    console.log(`Making API request to /api/roadmap/${roadMapActionId} (PUT)`);
    console.log('Request body:', requestBody);

    const response = await fetch(`/api/roadmap/${roadMapActionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // HttpOnly 쿠키 포함
      body: JSON.stringify(requestBody),
    });

    console.log('updateRoadmapAction - API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('updateRoadmapAction - API Error Response:', errorText);
      throw new Error(
        `Failed to update roadmap action: ${response.status} ${response.statusText}`
      );
    }

    const result: RoadmapApiResponse<object> = await response.json();
    console.log('updateRoadmapAction - API Response data:', result);

    if (result.result !== 'SUCCESS') {
      console.error('updateRoadmapAction - API returned error:', result.error);
      throw new Error(result.error?.message || 'API request failed');
    }
  } catch (error) {
    console.error('Error updating roadmap action:', error);
    throw error;
  }
};

// 로드맵 액션 삭제
export const deleteRoadmapAction = async (
  roadMapActionId: number
): Promise<void> => {
  try {
    console.log(
      `Making API request to /api/roadmap/${roadMapActionId} (DELETE)`
    );

    const response = await fetch(`/api/roadmap/${roadMapActionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // HttpOnly 쿠키 포함
    });

    console.log('deleteRoadmapAction - API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('deleteRoadmapAction - API Error Response:', errorText);
      throw new Error(
        `Failed to delete roadmap action: ${response.status} ${response.statusText}`
      );
    }

    const result: RoadmapApiResponse<object> = await response.json();
    console.log('deleteRoadmapAction - API Response data:', result);

    if (result.result !== 'SUCCESS') {
      console.error('deleteRoadmapAction - API returned error:', result.error);
      throw new Error(result.error?.message || 'API request failed');
    }
  } catch (error) {
    console.error('Error deleting roadmap action:', error);
    throw error;
  }
};

// 로드맵 액션 추가
export const addRoadmapAction = async (
  roadmapId: number,
  action: string
): Promise<void> => {
  try {
    const requestBody = { action };

    console.log(
      `Making API request to /api/roadmap/${roadmapId}/action (POST)`
    );
    console.log('Request body:', requestBody);

    const response = await fetch(`/api/roadmap/${roadmapId}/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // HttpOnly 쿠키 포함
      body: JSON.stringify(requestBody),
    });

    console.log('addRoadmapAction - API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('addRoadmapAction - API Error Response:', errorText);
      throw new Error(
        `Failed to add roadmap action: ${response.status} ${response.statusText}`
      );
    }

    const result: RoadmapApiResponse<object> = await response.json();
    console.log('addRoadmapAction - API Response data:', result);

    if (result.result !== 'SUCCESS') {
      console.error('addRoadmapAction - API returned error:', result.error);
      throw new Error(result.error?.message || 'API request failed');
    }
  } catch (error) {
    console.error('Error adding roadmap action:', error);
    throw error;
  }
};

// 로드맵 액션 추천
export const recommendRoadmapAction = async (
  category: string
): Promise<string[]> => {
  try {
    console.log(
      `Making API request to /api/roadmap/action/recommend?category=${category}`
    );

    const response = await fetch(
      `/api/roadmap/action/recommend?category=${encodeURIComponent(category)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // HttpOnly 쿠키 포함
      }
    );

    console.log(
      'recommendRoadmapAction - API Response status:',
      response.status
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('recommendRoadmapAction - API Error Response:', errorText);
      throw new Error(
        `Failed to recommend roadmap action: ${response.status} ${response.statusText}`
      );
    }

    const result: ApiResponse<RoadmapActionRecommendResponse> =
      await response.json();

    console.log('recommendRoadmapAction - API Response data:', result);

    if (result.result !== 'SUCCESS') {
      console.error(
        'recommendRoadmapAction - API returned error:',
        result.error
      );
      throw new Error(result.error?.message || 'API request failed');
    }

    return result.data.recommendRoadmapActionList;
  } catch (error) {
    console.error('Error recommending roadmap action:', error);
    throw error;
  }
};

// AI 채팅 옵션 조회
export const getAIChatOptions = async (
  sequence: number
): Promise<OptionResponse> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Access token not found');
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error(
        'NEXT_PUBLIC_BACKEND_URL 환경변수가 설정되지 않았습니다.'
      );
    }

    const response = await fetch(`${backendUrl}/job/chat/${sequence}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(
        `Failed to fetch AI chat options: ${response.status} ${response.statusText}`
      );
    }

    const result: ApiResponse<OptionResponse> = await response.json();

    if (result.result !== 'SUCCESS') {
      throw new Error(result.error?.message || 'API request failed');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching AI chat options:', error);
    throw error;
  }
};

// AI 채팅 답변 저장
export const saveAIChatAnswer = async (
  sequence: number,
  answer: string
): Promise<void> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Access token not found');
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error(
        'NEXT_PUBLIC_BACKEND_URL 환경변수가 설정되지 않았습니다.'
      );
    }

    const response = await fetch(
      `${backendUrl}/job/chat/${sequence}?answer=${encodeURIComponent(answer)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(
        `Failed to save AI chat answer: ${response.status} ${response.statusText}`
      );
    }

    const result: ApiResponse<object> = await response.json();

    if (result.result !== 'SUCCESS') {
      throw new Error(result.error?.message || 'API request failed');
    }
  } catch (error) {
    console.error('Error saving AI chat answer:', error);
    throw error;
  }
};

// AI 채팅 히스토리 조회
export const getAIChatHistory = async (): Promise<HistoryResponse> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Access token not found');
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error(
        'NEXT_PUBLIC_BACKEND_URL 환경변수가 설정되지 않았습니다.'
      );
    }

    const response = await fetch(`${backendUrl}/job/chat/history`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(
        `Failed to fetch AI chat history: ${response.status} ${response.statusText}`
      );
    }

    const result: ApiResponse<HistoryResponse> = await response.json();

    if (result.result !== 'SUCCESS') {
      throw new Error(result.error?.message || 'API request failed');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching AI chat history:', error);
    throw error;
  }
};

// HRD 교육과정 조회 (Education API)
export const getEducationCourses = async (filters?: {
  keyword?: string;
  pageNo?: number;
  pageSize?: number;
  startYmd?: string;
  endYmd?: string;
}): Promise<EducationSummary[]> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Access token not found');
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error(
        'NEXT_PUBLIC_BACKEND_URL 환경변수가 설정되지 않았습니다.'
      );
    }

    // 쿼리 파라미터 생성
    const queryParams = new URLSearchParams();

    if (filters?.keyword) {
      queryParams.append('keyword', filters.keyword);
    }

    if (filters?.pageNo !== undefined) {
      queryParams.append('page', filters.pageNo.toString());
    }

    if (filters?.pageSize !== undefined) {
      queryParams.append('size', filters.pageSize.toString());
    }

    if (filters?.startYmd) {
      queryParams.append('startYmd', filters.startYmd);
    }

    if (filters?.endYmd) {
      queryParams.append('endYmd', filters.endYmd);
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `${backendUrl}/job/hrd-course?${queryString}`
      : `${backendUrl}/job/hrd-course`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(
        `Failed to fetch education courses: ${response.status} ${response.statusText}`
      );
    }

    const result: EducationApiResponse = await response.json();

    if (result.result !== 'SUCCESS') {
      throw new Error(result.error?.message || 'API request failed');
    }

    // CardCourseItem을 EducationSummary로 변환
    return result.data.srchList.map((item) => ({
      id: item.trprId,
      educationId: parseInt(item.trprId),
      trprId: item.trprId,
      title: item.title,
      subTitle: item.subTitle,
      institution: item.instCd, // 기관 코드를 기관명으로 사용
      address: item.address,
      traStartDate: item.traStartDate,
      traEndDate: item.traEndDate,
      trainTarget: item.trainTarget,
      contents: item.contents,
      certificate: item.certificate,
      grade: item.grade,
      regCourseMan: item.regCourseMan,
      courseMan: item.courseMan,
      realMan: item.realMan,
      yardMan: item.yardMan,
      telNo: item.telNo,
      stdgScor: item.stdgScor,
      eiEmplCnt3: item.eiEmplCnt3,
      eiEmplRate3: item.eiEmplRate3,
      eiEmplCnt3Gt10: item.eiEmplCnt3Gt10,
      eiEmplRate6: item.eiEmplRate6,
      ncsCd: item.ncsCd,
      trprDegr: item.trprDegr,
      instCd: item.instCd,
      trngAreaCd: item.trngAreaCd,
      trainTargetCd: item.trainTargetCd,
      trainstCstId: item.trainstCstId,
      subTitleLink: item.subTitleLink,
      titleLink: item.titleLink,
      titleIcon: item.titleIcon,
      isBookmark: false,
      recommendScore: undefined,
    }));
  } catch (error) {
    console.error('Error fetching education courses:', error);
    throw error;
  }
};

// 맞춤형 교육 추천 (로그인 시)
export const getRecommendedEducations = async (): Promise<
  EducationSummary[]
> => {
  try {
    console.log('Making API request to /api/education/recommend');

    const response = await fetch('/api/education/recommend', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // HttpOnly 쿠키 포함
    });

    console.log(
      'getRecommendedEducations - API Response status:',
      response.status
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        'getRecommendedEducations - API Error Response:',
        errorText
      );
      throw new Error(
        `Failed to fetch recommended educations: ${response.status} ${response.statusText}`
      );
    }

    const result: EducationDataResponse = await response.json();
    console.log('getRecommendedEducations - API Response data:', result);

    if (result.result !== 'SUCCESS') {
      console.error(
        'getRecommendedEducations - API returned error:',
        result.error
      );
      throw new Error(result.error?.message || 'API request failed');
    }

    // EducationDto를 EducationSummary로 변환
    return (result.data.educationDtoList || []).map((edu) => ({
      id: edu.educationId.toString(),
      educationId: edu.educationId,
      trprId: edu.educationId.toString(),
      title: edu.title || '',
      subTitle: edu.subTitle || '',
      institution: edu.subTitle || '',
      address: edu.address || '',
      traStartDate: edu.traStartDate || '',
      traEndDate: edu.traEndDate || '',
      trainTarget: '',
      contents: '',
      certificate: '',
      grade: '',
      regCourseMan: '0',
      courseMan: edu.courseMan || '0',
      realMan: '0',
      yardMan: '0',
      telNo: '',
      stdgScor: '0',
      eiEmplCnt3: '0',
      eiEmplRate3: '0',
      eiEmplCnt3Gt10: '0',
      eiEmplRate6: '0',
      ncsCd: '',
      trprDegr: edu.trprDegr || '',
      instCd: '',
      trngAreaCd: '',
      trainTargetCd: '',
      trainstCstId: '',
      subTitleLink: '',
      titleLink: edu.titleLink || '',
      titleIcon: '',
      imageUrl: edu.imageUrl || '',
      isBookmark: edu.isBookmark || false,
      recommendScore: edu.score ?? undefined,
      keyword1: edu.keyword1,
      keyword2: edu.keyword2,
    }));
  } catch (error) {
    console.error('Error fetching recommended educations:', error);
    throw error;
  }
};

// 전체 교육 조회 (비로그인 시)
export const getAllEducationsAnonymous = async (filters?: {
  keyword?: string;
  pageNo?: number;
  pageSize?: number;
  startYmd?: string;
  endYmd?: string;
}): Promise<EducationDataResponse['data']> => {
  try {
    console.log(
      'Making API request to /api/education/anonymous with filters:',
      filters
    );

    // 쿼리 파라미터 생성
    const queryParams = new URLSearchParams();

    if (filters?.keyword) {
      queryParams.append('keyword', filters.keyword);
    }

    if (filters?.pageNo !== undefined) {
      queryParams.append('page', filters.pageNo.toString());
    }

    if (filters?.pageSize !== undefined) {
      queryParams.append('size', filters.pageSize.toString());
    }

    if (filters?.startYmd) {
      queryParams.append('startYmd', filters.startYmd);
    }

    if (filters?.endYmd) {
      queryParams.append('endYmd', filters.endYmd);
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `/api/education/anonymous?${queryString}`
      : `/api/education/anonymous`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(
      'getAllEducationsAnonymous - API Response status:',
      response.status
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        'getAllEducationsAnonymous - API Error Response:',
        errorText
      );
      throw new Error(
        `Failed to fetch all educations: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log('getAllEducationsAnonymous - API Response data:', result);

    if (result.result !== 'SUCCESS') {
      console.error(
        'getAllEducationsAnonymous - API returned error:',
        result.error
      );
      throw new Error(result.error?.message || 'API request failed');
    }

    // API 응답을 그대로 반환
    return result.data;
  } catch (error) {
    console.error('Error fetching all educations:', error);
    throw error;
  }
};

// HRD 교육과정 조회 (로그인 시 전체 교육)
export const getHrdEducations = async (filters?: {
  keyword?: string;
  pageNo?: number;
  pageSize?: number;
  startYmd?: string;
  endYmd?: string;
}): Promise<EducationDataResponse['data']> => {
  try {
    console.log(
      'Making API request to /api/education/all with filters:',
      filters
    );

    // 쿼리 파라미터 생성
    const queryParams = new URLSearchParams();

    if (filters?.keyword) {
      queryParams.append('keyword', filters.keyword);
    }

    if (filters?.pageNo !== undefined) {
      queryParams.append('page', filters.pageNo.toString());
    }

    if (filters?.pageSize !== undefined) {
      queryParams.append('size', filters.pageSize.toString());
    }

    if (filters?.startYmd) {
      queryParams.append('startYmd', filters.startYmd);
    }

    if (filters?.endYmd) {
      queryParams.append('endYmd', filters.endYmd);
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `/api/education/all?${queryString}`
      : `/api/education/all`;

    console.log('getHrdEducations - Fetching URL:', url);
    console.log('getHrdEducations - Query params:', queryString);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // HttpOnly 쿠키 포함
      cache: 'no-store',
    });

    console.log('getHrdEducations - API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('getHrdEducations - API Error Response:', errorText);
      throw new Error(
        `Failed to fetch HRD educations: ${response.status} ${response.statusText}`
      );
    }

    const result = (await response.json()) as
      | EducationDataResponse
      | EducationApiResponse;
    console.log('getHrdEducations - API Response data:', result);
    console.log('getHrdEducations - result.result:', result.result);
    console.log('getHrdEducations - result.data:', result.data);

    if (result.result !== 'SUCCESS') {
      console.error('getHrdEducations - API returned error:', result.error);
      throw new Error(result.error?.message || 'API request failed');
    }

    let mappedData: EducationDto[] = [];
    let totalElements = 0;

    // educationDtoList가 있는 경우 (EducationDataResponse)
    if ('educationDtoList' in result.data && result.data.educationDtoList) {
      console.log(
        'getHrdEducations - Found educationDtoList, length:',
        result.data.educationDtoList.length
      );
      mappedData = result.data.educationDtoList;
      totalElements = result.data.totalElements || mappedData.length;
    }
    // srchList가 있는 경우 (EducationApiResponse) - CardCourseItem을 EducationSummary로 변환
    else if ('srchList' in result.data && result.data.srchList) {
      console.log(
        'getHrdEducations - Found srchList, length:',
        result.data.srchList.length
      );
      mappedData = result.data.srchList.map(
        (item: CardCourseItem, index: number) => {
          console.log(
            `getHrdEducations - Mapping CardCourseItem ${index}:`,
            item
          );
          return {
            trprId: parseInt(item.trprId || index.toString()),
            educationId: parseInt(item.trprId || index.toString()),
            title: item.title || '제목 없음',
            subTitle: item.subTitle || '',
            traStartDate: item.traStartDate || '',
            traEndDate: item.traEndDate || '',
            address: item.address || '',
            courseMan: item.courseMan || '0',
            keyword1: '',
            keyword2: '',
            trprDegr: item.trprDegr || '',
            imageUrl: '',
            titleLink: item.titleLink || '',
            isBookmark: false,
            score: null,
          };
        }
      );
      totalElements = result.data.scn_cnt || mappedData.length;
    } else {
      console.log(
        'getHrdEducations - No educationDtoList or srchList found in result.data:',
        result.data
      );
      return {
        totalElements: 0,
        numberOfElements: 0,
        educationDtoList: [],
      };
    }

    console.log('getHrdEducations - Final mapped data:', mappedData);
    console.log(
      'getHrdEducations - Final mapped data length:',
      mappedData.length
    );
    console.log('getHrdEducations - Total elements:', totalElements);

    return {
      totalElements,
      numberOfElements: mappedData.length,
      educationDtoList: mappedData,
    };
  } catch (error) {
    console.error('Error fetching HRD educations:', error);
    throw error;
  }
};

// 교육 프로그램 찜 목록 조회
export const getEducationBookmarks = async (): Promise<string[]> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Access token not found');
    }

    const response = await fetch('/api/heart-lists/edu/history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch education bookmarks');
    }

    const result = await response.json();

    if (result.result !== 'SUCCESS') {
      throw new Error(result.error?.message || 'API request failed');
    }

    // API 응답에서 교육 프로그램 ID 목록 추출
    return (
      result.data?.map(
        (item: { trprId?: string; id?: string }) => item.trprId || item.id
      ) || []
    );
  } catch (error) {
    console.error('Error fetching education bookmarks:', error);
    throw error;
  }
};
