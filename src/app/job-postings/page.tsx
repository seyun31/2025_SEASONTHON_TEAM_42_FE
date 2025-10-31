'use client';

import JobCard from '@/components/features/job/JobCard';
import SearchBar from '@/components/ui/SearchBar';
import JobTab from '@/components/ui/JobTab';
import JobCardSkeleton from '@/components/ui/JobCardSkeleton';
import JobFilter from '@/components/ui/JobFilter';
import Footer from '@/components/layout/Footer';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getUserData, getAccessToken } from '@/lib/auth';
import {
  getRecommendedJobs,
  getAllJobs,
  getAllJobsForLoggedIn,
} from '@/lib/api/jobApi';
import { AllResponse, JobResponse } from '@/types/job';

export default function JobPostings() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'custom' | 'all'>('custom');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [jobs, setJobs] = useState<(AllResponse | JobResponse)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] =
    useState<string>('');
  const [filters, setFilters] = useState<{
    selectedRegion: string;
    selectedDistricts: string[];
    employmentType: string[];
    jobCategory: string[];
  }>({
    selectedRegion: '',
    selectedDistricts: [],
    employmentType: [],
    jobCategory: [],
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

  // 검색어 디바운싱 (500ms 지연)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // 데이터 로드 함수
  const fetchJobs = async (page: number = 1) => {
    try {
      setIsLoading(true);
      let jobData: (AllResponse | JobResponse)[] = [];
      let totalElements = 0;

      // 필터 데이터를 API 형식으로 변환 (페이지네이션 포함)
      const apiFilters = {
        keyword: debouncedSearchKeyword || undefined,
        page: page - 1, // API는 0 기반 페이지
        size: 10,
        workLocation:
          filters.selectedDistricts.length > 0
            ? filters.selectedDistricts
            : undefined,
        employmentType:
          filters.employmentType.length > 0
            ? filters.employmentType
            : undefined,
        jobCategory:
          filters.jobCategory.length > 0 ? filters.jobCategory : undefined,
      };

      if (activeTab === 'custom' && isLoggedIn) {
        // 맞춤공고 탭 (로그인 시에만) - /job/recommend/job 엔드포인트 사용
        jobData = await getRecommendedJobs();
        totalElements = jobData.length; // 맞춤 공고는 페이지네이션이 없을 수 있음
      } else if (activeTab === 'all' && isLoggedIn) {
        // 전체공고 탭 (로그인 시) - /job/all 엔드포인트 사용
        const result = await getAllJobsForLoggedIn(apiFilters);
        jobData = result.jobDtoList || [];
        totalElements = result.totalElements || 0;
      } else {
        // 전체공고 탭 (비로그인 시) - /job/all/anonymous 엔드포인트 사용
        const result = await getAllJobs(apiFilters);
        jobData = result.jobDtoList || [];
        totalElements = result.totalElements || 0;
      }

      setJobs(jobData);
      setTotalElements(totalElements);
      setTotalPages(Math.ceil(totalElements / 10));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
      setTotalElements(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // 탭, 필터, 검색어 변경 시 첫 페이지로 데이터 로드
  useEffect(() => {
    setCurrentPage(1);
    fetchJobs(1);
  }, [activeTab, isLoggedIn, filters, debouncedSearchKeyword]);

  // 페이지 변경 시 데이터 로드
  useEffect(() => {
    if (currentPage > 1) {
      fetchJobs(currentPage);
    }
  }, [currentPage]);

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
        companyLogo: job.imageUrl || job.companyLogo, // imageUrl을 우선 사용하고, 없으면 companyLogo 사용
        jobTitle: job.jobTitle,
        jobCategory: job.jobCategory,
        workLocation: job.workLocation,
        employmentType: job.employmentType,
        salary: (job as { wage?: string }).wage || job.salary || '급여 미정',
        workPeriod:
          (job as { workTime?: string }).workTime ||
          job.workPeriod ||
          '근무기간 미정',
        experience: job.experience || '경력 무관',
        requiredSkills: job.requiredSkills || '',
        preferredSkills: job.preferredSkills || '',
        postingDate: job.postingDate,
        closingDate: job.closingDate,
        applyLink: job.applyLink || '#',
        requiredDocuments: job.requiredDocuments,
        jobRecommendScore: job.score || null,
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
        requiredDocuments: undefined, // API에서 제공하지 않음
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
            <SearchBar onSearchChange={setSearchKeyword} />

            <JobFilter onFilterChange={setFilters} />

            {isLoggedIn && (
              <JobTab
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isLoggedIn={isLoggedIn}
              />
            )}

            <div className="flex flex-col md:flex-row gap-6 mt-12">
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

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1 xs:gap-2 md:gap-2 lg:gap-2 mt-8 xs:mt-10 md:mt-12 lg:mt-12 mb-6 xs:mb-7 md:mb-8 lg:mb-8">
                {/* 첫 페이지 버튼 */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-2 xs:px-2 md:px-3 lg:px-3 py-1.5 xs:py-1.5 md:py-2 lg:py-2 text-xs xs:text-sm md:text-base lg:text-base rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  &lt;&lt;
                </button>

                {/* 이전 버튼 */}
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 xs:px-3 md:px-4 lg:px-4 py-1.5 xs:py-1.5 md:py-2 lg:py-2 text-xs xs:text-sm md:text-base lg:text-base rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  &lt;
                </button>

                {/* 페이지 번호들 */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[32px] xs:min-w-[36px] md:min-w-[40px] lg:min-w-[40px] px-2.5 xs:px-3 md:px-4 lg:px-4 py-1.5 xs:py-1.5 md:py-2 lg:py-2 text-xs xs:text-sm md:text-base lg:text-base rounded-lg border font-medium cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-primary-90 text-white border-primary-90 shadow-md'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* 다음 버튼 */}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-2.5 xs:px-3 md:px-4 lg:px-4 py-1.5 xs:py-1.5 md:py-2 lg:py-2 text-xs xs:text-sm md:text-base lg:text-base rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  &gt;
                </button>

                {/* 마지막 페이지 버튼 */}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 xs:px-2 md:px-3 lg:px-3 py-1.5 xs:py-1.5 md:py-2 lg:py-2 text-xs xs:text-sm md:text-base lg:text-base rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  &gt;&gt;
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
