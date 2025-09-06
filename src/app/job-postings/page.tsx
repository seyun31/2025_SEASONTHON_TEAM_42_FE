'use client';

import JobCard from '@/components/card-component/JobCard';
import SearchBar from '@/components/ui/SearchBar';
import JobTab from '@/components/ui/JobTab';
import JobCardSkeleton from '@/components/ui/JobCardSkeleton';
import JobFilter from '@/components/ui/JobFilter';
import Footer from '@/components/layout/Footer';
import { jobRecommendations } from '@/mock/jobData';
import { useState, useEffect } from 'react';
import { getUserData, getAccessToken } from '@/lib/auth';
import {
  getRecommendedJobs,
  getAllJobs,
  getAllJobsForLoggedIn,
} from '@/apis/jobApi';
import { AllResponse, JobResponse } from '@/types/job';

export default function JobPostings() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'custom' | 'all'>('custom');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [jobs, setJobs] = useState<(AllResponse | JobResponse)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    location: 'all',
    employmentType: 'all',
    jobCategory: 'all',
  });

  // 초기 로그인 상태 확인 및 데이터 로드
  useEffect(() => {
    const userData = getUserData();
    const token = getAccessToken();
    const loggedIn = !!(userData?.name && token);

    console.log('JobPostings - Login check:', { userData, token, loggedIn });
    setIsLoggedIn(loggedIn);

    // 비로그인 시 전체공고 탭으로 설정
    if (!loggedIn) {
      setActiveTab('all');
    }
  }, []);

  // 탭 변경 시 API 호출
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log('JobPostings - Fetching jobs:', { activeTab, isLoggedIn });
        setIsLoading(true);
        let jobData: (AllResponse | JobResponse)[] = [];

        if (activeTab === 'custom' && isLoggedIn) {
          // 맞춤공고 탭 (로그인 시에만) - /job/recommend/job 엔드포인트 사용
          console.log('Fetching recommended jobs...');
          jobData = await getRecommendedJobs();
        } else if (activeTab === 'all' && isLoggedIn) {
          // 전체공고 탭 (로그인 시) - /job/all 엔드포인트 사용
          console.log('Fetching all jobs for logged in user...');
          jobData = await getAllJobsForLoggedIn();
        } else {
          // 전체공고 탭 (비로그인 시) - /job/all/anonymous 엔드포인트 사용
          console.log('Fetching all jobs for anonymous user...');
          jobData = await getAllJobs();
        }

        console.log('JobPostings - Jobs fetched:', jobData.length);
        setJobs(jobData);
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
  }, [activeTab, isLoggedIn]);

  const toggleScrap = (jobId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(jobId)) {
      newFavorites.delete(jobId);
    } else {
      newFavorites.add(jobId);
    }
    setFavorites(newFavorites);
  };

  // API 데이터를 JobCard 컴포넌트에 맞는 형태로 변환
  const convertToJobCardFormat = (job: AllResponse | JobResponse) => {
    if ('jobTitle' in job) {
      // AllResponse 타입 (전체 채용 조회 - 로그인/비로그인 모두)
      return {
        id: job.jobId,
        jobId: job.jobId.toString(),
        companyName: job.companyName,
        companyLogo: job.companyLogo,
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
        companyLogo: '', // API에서 제공하지 않음
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
      <div>
        <main className="min-h-screen bg-white">
          <section className="w-full px-4 py-8">
            <div className="max-w-[1200px] mx-auto">
              <SearchBar />

              <JobFilter onFilterChange={setFilters} />

              {isLoggedIn && (
                <JobTab
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  isLoggedIn={isLoggedIn}
                />
              )}

              <div className="flex flex-row gap-6 mt-12">
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
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <main className="min-h-screen bg-white">
        <section className="w-full px-4 py-8">
          <div className="max-w-[1200px] mx-auto">
            <SearchBar />

            <JobFilter onFilterChange={setFilters} />

            {isLoggedIn && (
              <JobTab
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isLoggedIn={isLoggedIn}
              />
            )}

            <div className="flex flex-row gap-6 mt-12">
              <div className="flex flex-col gap-6 flex-1">
                {jobs.slice(0, Math.ceil(jobs.length / 2)).map((job, index) => (
                  <JobCard
                    key={job.jobId || index}
                    job={convertToJobCardFormat(job)}
                    onToggleScrap={toggleScrap}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-6 flex-1">
                {jobs.slice(Math.ceil(jobs.length / 2)).map((job, index) => (
                  <JobCard
                    key={job.jobId || index + Math.ceil(jobs.length / 2)}
                    job={convertToJobCardFormat(job)}
                    onToggleScrap={toggleScrap}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
