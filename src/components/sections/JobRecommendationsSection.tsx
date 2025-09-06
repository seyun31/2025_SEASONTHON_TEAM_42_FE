'use client';

import { jobRecommendations } from '@/mock/jobData';
import { useState, useEffect } from 'react';
import JobCard from '@/components/card-component/JobCard';
import JobCardSkeleton from '@/components/ui/JobCardSkeleton';
import { getUserData, getAccessToken } from '@/lib/auth';
import { getRecommendedJobs, getAllJobs } from '@/apis/jobApi';
import { AllResponse, JobResponse } from '@/types/job';

export default function JobRecommendationsSection() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [userName, setUserName] = useState<string>('');
  const [jobs, setJobs] = useState<(AllResponse | JobResponse)[]>([]);
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
        let jobData: (AllResponse | JobResponse)[] = [];

        if (loggedIn) {
          // 로그인 시: 맞춤형 일자리 추천
          jobData = await getRecommendedJobs();
        } else {
          // 비로그인 시: 전체 채용 조회
          jobData = await getAllJobs();
        }

        // 8개로 제한
        setJobs(jobData.slice(0, 8));
      } catch (error) {
        console.error('Error fetching jobs:', error);
        // 에러 시 mock 데이터 사용
        setJobs(
          jobRecommendations.slice(0, 8) as unknown as (
            | AllResponse
            | JobResponse
          )[]
        );
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
  const convertToJobCardFormat = (job: AllResponse | JobResponse) => {
    if ('jobTitle' in job) {
      // AllResponse 타입 (전체 채용 조회)
      return {
        id: job.jobId,
        jobId: job.jobId.toString(),
        companyName: job.companyName,
        companyLogo: job.imageUrl || job.companyLogo, // imageUrl을 우선 사용하고, 없으면 companyLogo 사용
        jobTitle: job.jobTitle,
        jobCategory: job.jobCategory,
        workLocation: job.workLocation,
        employmentType: job.employmentType,
        salary: job.salary,
        workPeriod: job.workPeriod,
        experience: job.experience,
        requiredSkills: job.requiredSkills,
        preferredSkills: job.preferredSkills,
        postingDate: job.postingDate,
        closingDate: job.closingDate,
        applyLink: job.applyLink,
        jobRecommendScore: job.jobRecommendScore || null,
        isScrap: job.isBookmark,
      };
    } else {
      // JobResponse 타입 (맞춤형 일자리 추천)
      return {
        id: parseInt(job.jobId) || 0,
        jobId: job.jobId,
        companyName: job.companyName,
        companyLogo: job.imageUrl || '', // imageUrl을 companyLogo로 사용
        jobTitle: job.keyword, // keyword를 jobTitle로 사용
        jobCategory: '', // API에서 제공하지 않음
        workLocation: job.workLocation,
        employmentType: '', // API에서 제공하지 않음
        salary: '', // API에서 제공하지 않음
        workPeriod: '', // API에서 제공하지 않음
        experience: '', // API에서 제공하지 않음
        requiredSkills: '', // API에서 제공하지 않음
        preferredSkills: '', // API에서 제공하지 않음
        postingDate: '', // API에서 제공하지 않음
        closingDate: job.closingDate,
        applyLink: '', // API에서 제공하지 않음
        jobRecommendScore: job.jobRecommendScore
          ? parseInt(job.jobRecommendScore)
          : null,
        isScrap: job.isBookmark,
      };
    }
  };

  if (isLoading) {
    return (
      <section className="w-full px-4 py-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-title-xlarge text-gray-80">
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

  return (
    <section className="w-full px-4 py-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-title-xlarge text-gray-80">
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
