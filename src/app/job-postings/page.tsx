import { cookies } from 'next/headers';
import JobPostingsClient from './JobPostingsClient';
import { AllResponse, JobResponse } from '@/types/job';

async function fetchInitialJobs(
  isLoggedIn: boolean,
  tab?: string
): Promise<{ jobs: (AllResponse | JobResponse)[]; totalElements: number }> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    return { jobs: [], totalElements: 0 };
  }

  try {
    if (isLoggedIn) {
      const accessToken = (await cookies()).get('accessToken')?.value;
      if (!accessToken) {
        return { jobs: [], totalElements: 0 };
      }

      // 맞춤 공고 탭인 경우 /job/recommend/job 호출
      if (tab === 'recommend' || tab === 'custom') {
        const response = await fetch(`${backendUrl}/job/recommend/job`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });
        if (!response.ok) {
          return { jobs: [], totalElements: 0 };
        }
        const result = await response.json();
        if (result.result !== 'SUCCESS') {
          return { jobs: [], totalElements: 0 };
        }
        const jobList = result.data.jobDtoList || [];
        return {
          jobs: jobList,
          totalElements: jobList.length,
        };
      }

      // 전체 공고 탭 또는 기본값
      const response = await fetch(`${backendUrl}/job/all?page=0&size=10`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });
      if (!response.ok) {
        return { jobs: [], totalElements: 0 };
      }
      const result = await response.json();
      if (result.result !== 'SUCCESS') {
        return { jobs: [], totalElements: 0 };
      }
      return {
        jobs: result.data.jobDtoList || [],
        totalElements: result.data.totalElements || 0,
      };
    } else {
      const response = await fetch(
        `${backendUrl}/job/all/anonymous?page=0&size=10`,
        {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        }
      );
      if (!response.ok) {
        return { jobs: [], totalElements: 0 };
      }
      const result = await response.json();
      if (result.result !== 'SUCCESS') {
        return { jobs: [], totalElements: 0 };
      }
      return {
        jobs: result.data.jobDtoList || [],
        totalElements: result.data.totalElements || 0,
      };
    }
  } catch {
    return { jobs: [], totalElements: 0 };
  }
}

export default async function JobPostings({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string }>;
}) {
  const cookieStore = await cookies();
  const isLoggedIn = Boolean(cookieStore.get('accessToken')?.value);
  const params = await searchParams;
  const { jobs, totalElements } = await fetchInitialJobs(
    isLoggedIn,
    params.tab
  );

  return (
    <JobPostingsClient
      initialJobs={jobs}
      initialTotalElements={totalElements}
      isLoggedInInitial={isLoggedIn}
    />
  );
}
