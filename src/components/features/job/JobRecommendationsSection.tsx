'use client';

import { useState, useEffect } from 'react';
import JobCard from '@/components/features/job/JobCard';
import JobCardSkeleton from '@/components/ui/JobCardSkeleton';
import EmptyRecommendations from '@/components/features/job/EmptyRecommendations';
import { getUserData, getAccessToken } from '@/lib/auth';
import { getRecommendedJobs, getAllJobs } from '@/lib/api/jobApi';
import { AllResponse } from '@/types/job';

export default function JobRecommendationsSection() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [userName, setUserName] = useState<string>('');
  const [jobs, setJobs] = useState<AllResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const userData = getUserData();
    const token = getAccessToken();
    const loggedIn = !!(userData?.name && token);

    if (loggedIn) {
      setUserName(userData.name);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    // 로그인 상태에 따라 다른 API 호출
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        let jobData: AllResponse[] = [];

        if (loggedIn) {
          // 로그인 시: 맞춤형 일자리 추천
          console.log(
            'JobRecommendationsSection - Fetching recommended jobs for logged in user'
          );
          jobData = await getRecommendedJobs();
          console.log(
            'JobRecommendationsSection - Recommended jobs fetched:',
            jobData.length,
            jobData
          );
        } else {
          // 비로그인 시: 전체 채용 조회
          console.log(
            'JobRecommendationsSection - Fetching all jobs for anonymous user'
          );
          jobData = await getAllJobs();
          console.log(
            'JobRecommendationsSection - All jobs fetched:',
            jobData.length,
            jobData
          );
        }

        // null이나 빈 배열인 경우 처리
        if (!jobData || jobData.length === 0) {
          console.log(
            'JobRecommendationsSection - No jobs found, setting empty array'
          );
          setJobs([]);
          return;
        }

        // 8개로 제한
        setJobs(jobData.slice(0, 8));
      } catch (error) {
        console.error('Error fetching jobs:', error);
        // 에러 시 빈 배열 설정
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  // API 데이터를 JobCard 컴포넌트에 맞는 형태로 변환
  const convertToJobCardFormat = (job: AllResponse) => {
    return {
      id: job.jobId,
      jobId: job.jobId.toString(),
      companyName: job.companyName,
      companyLogo: job.imageUrl || job.companyLogo, // imageUrl을 우선 사용하고, 없으면 companyLogo 사용
      jobTitle: job.jobTitle,
      jobCategory: job.jobCategory,
      workLocation: job.workLocation,
      employmentType: job.employmentType,
      salary: (job as { wage?: string }).wage || job.salary, // API에서는 wage 필드 사용
      workPeriod:
        (job as { workTime?: string }).workTime || job.workPeriod || '미정', // API에서는 workTime 필드 사용
      experience: job.experience || '경력 무관', // API에 experience가 없으므로 기본값 설정
      requiredSkills: job.requiredSkills || '', // API에서 제공되는 requiredSkills 사용
      preferredSkills: job.preferredSkills || '',
      postingDate: job.postingDate,
      closingDate: job.closingDate,
      applyLink: job.applyLink || '#', // API에 applyLink가 없으므로 기본값 설정
      requiredDocuments: job.requiredDocuments,
      jobRecommendScore: job.score || null,
      isScrap: job.isBookmark,
    };
  };

  if (isLoading) {
    return (
      <section className="w-full px-4 py-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-4xl font-semibold text-gray-80 text-left items-center">
              {userName
                ? `${userName}님을 위한 오늘의 맞춤 일자리 추천`
                : '오늘의 일자리 추천'}
            </h2>
            <a
              href="/job-postings"
              className="text-primary-300 hover:text-primary-600 transition-colors"
            >
              더보기
            </a>
          </div>

          <div className="flex flex-row gap-6">
            <div className="flex flex-col gap-6 flex-1">
              {Array.from({ length: 4 }).map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
            <div className="flex flex-col gap-6 flex-1">
              {Array.from({ length: 4 }).map((_, index) => (
                <JobCardSkeleton key={index + 4} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 빈 상태 처리 (로그인 사용자이고 추천 공고가 없는 경우)
  if (isLoggedIn && jobs.length === 0) {
    return <EmptyRecommendations userName={userName} />;
  }

  return (
    <section className="w-full px-4 py-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-4xl font-semibold text-gray-80 text-left items-center">
            {userName ? (
              <>
                {userName}님을 위한 <br className="md:hidden" /> 오늘의 맞춤
                일자리 추천
              </>
            ) : (
              '오늘의 일자리 추천'
            )}
          </h2>
          <a
            href="/job-postings"
            className="text-primary-300 hover:text-primary-600 transition-colors"
          >
            더보기
          </a>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col gap-6 flex-1">
            {jobs.slice(0, 4).map((job, index) => (
              <JobCard
                key={job.jobId || index}
                job={convertToJobCardFormat(job)}
                onToggleScrap={toggleFavorite}
              />
            ))}
          </div>
          <div className="flex flex-col gap-6 flex-1">
            {jobs.slice(4, 8).map((job, index) => (
              <JobCard
                key={job.jobId || index + 4}
                job={convertToJobCardFormat(job)}
                onToggleScrap={toggleFavorite}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
