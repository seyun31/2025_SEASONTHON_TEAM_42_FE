import {
  JobSummary,
  JobDetail,
  ApiResponse,
  SearchAllResponse,
  AllResponse,
  JobResponse,
} from '@/types/job';
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
export const getRecommendedJobs = async (): Promise<JobResponse[]> => {
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(
        `Failed to fetch recommended jobs: ${response.status} ${response.statusText}`
      );
    }

    const result: ApiResponse<JobResponse> = await response.json();

    if (result.result !== 'SUCCESS') {
      throw new Error(result.error?.message || 'API request failed');
    }

    return Array.isArray(result.data) ? result.data : [result.data];
  } catch (error) {
    console.error('Error fetching recommended jobs:', error);
    throw error;
  }
};

// 전체 채용 조회 (비로그인 시)
export const getAllJobs = async (): Promise<AllResponse[]> => {
  try {
    console.log('Making API request to /job/all/anonymous');

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      throw new Error(
        'NEXT_PUBLIC_BACKEND_URL 환경변수가 설정되지 않았습니다.'
      );
    }

    const response = await fetch(`${backendUrl}/job/all/anonymous`, {
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
export const getAllJobsForLoggedIn = async (): Promise<AllResponse[]> => {
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

    const response = await fetch(`${backendUrl}/job/all`, {
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
