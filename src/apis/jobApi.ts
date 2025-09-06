import {
  JobSummary,
  JobDetail,
  ApiResponse,
  SearchAllResponse,
  AllResponse,
  JobResponse,
} from '@/types/job';
import {
  RoadMapResponse,
  RoadMapStep,
  ActionDto,
  RoadMapRequest,
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
    const token = getAccessToken();
    if (!token) {
      throw new Error('Access token not found');
    }

    console.log('Token found, making API request to /job/recommend/job');

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      throw new Error(
        'NEXT_PUBLIC_BACKEND_URL 환경변수가 설정되지 않았습니다.'
      );
    }

    const response = await fetch(`${backendUrl}/job/recommend/job`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('getRecommendedJobs - API Response status:', response.status);
    console.log('getRecommendedJobs - API Response headers:', response.headers);

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
  workLocation?: string[];
  employmentType?: string[];
  jobCategory?: string[];
}): Promise<AllResponse[]> => {
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

    return result.data.jobDtoList || [];
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    throw error;
  }
};

// 전체 채용 조회 (로그인 시)
export const getAllJobsForLoggedIn = async (filters?: {
  keyword?: string;
  workLocation?: string[];
  employmentType?: string[];
  jobCategory?: string[];
}): Promise<AllResponse[]> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Access token not found');
    }

    console.log('Making API request to /job/all');

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
      ? `${backendUrl}/job/all?${queryString}`
      : `${backendUrl}/job/all`;

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
        `Failed to fetch all jobs: ${response.status} ${response.statusText}`
      );
    }

    const result: ApiResponse<SearchAllResponse> = await response.json();

    if (result.result !== 'SUCCESS') {
      throw new Error(result.error?.message || 'API request failed');
    }

    return result.data.jobDtoList || [];
  } catch (error) {
    console.error('Error fetching all jobs for logged in user:', error);
    throw error;
  }
};

// 로드맵 조회
export const getRoadMap = async (): Promise<RoadMapResponse> => {
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

    const response = await fetch(`${backendUrl}/job/recommend/roadmap`, {
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
        `Failed to fetch roadmap: ${response.status} ${response.statusText}`
      );
    }

    const result: RoadmapApiResponse<RoadMapResponse> = await response.json();

    if (result.result !== 'SUCCESS') {
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

    const response = await fetch(`${backendUrl}/job/recommend/roadmap`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(
        `Failed to recommend roadmap: ${response.status} ${response.statusText}`
      );
    }

    const result: RoadmapApiResponse<RoadMapResponse> = await response.json();

    if (result.result !== 'SUCCESS') {
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
  roadMapId: number,
  roadMapActionId: number
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
      `${backendUrl}/job/roadmap/${roadMapId}/${roadMapActionId}`,
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
        `Failed to toggle roadmap action: ${response.status} ${response.statusText}`
      );
    }

    const result: RoadmapApiResponse<object> = await response.json();

    if (result.result !== 'SUCCESS') {
      throw new Error(result.error?.message || 'API request failed');
    }
  } catch (error) {
    console.error('Error toggling roadmap action:', error);
    throw error;
  }
};
