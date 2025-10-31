'use client';

import JobCard from '@/components/features/job/JobCard';
import SearchBar from '@/components/ui/SearchBar';
import JobTab from '@/components/ui/JobTab';
import JobCardSkeleton from '@/components/ui/JobCardSkeleton';
import JobFilter from '@/components/ui/JobFilter';
import Footer from '@/components/layout/Footer';
import { useState, useEffect } from 'react';
import {
  getRecommendedJobs,
  getAllJobs,
  getAllJobsForLoggedIn,
} from '@/lib/api/jobApi';
import { AllResponse, JobResponse, SearchAllResponse } from '@/types/job';

interface JobPostingsClientProps {
  initialJobs: (AllResponse | JobResponse)[];
  initialTotalElements: number;
  isLoggedInInitial: boolean;
}

export default function JobPostingsClient({
  initialJobs,
  initialTotalElements,
  isLoggedInInitial,
}: JobPostingsClientProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'custom' | 'all'>(
    isLoggedInInitial ? 'custom' : 'all'
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(isLoggedInInitial);
  const [jobs, setJobs] = useState<(AllResponse | JobResponse)[]>(initialJobs);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(
    Math.max(1, Math.ceil((initialTotalElements || initialJobs.length) / 10))
  );
  const [totalElements, setTotalElements] = useState<number>(
    initialTotalElements || initialJobs.length
  );
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
      let newTotalElements = 0;

      const apiFilters = {
        keyword: debouncedSearchKeyword || undefined,
        page: page - 1,
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
        jobData = await getRecommendedJobs();
        newTotalElements = jobData.length;
      } else if (activeTab === 'all' && isLoggedIn) {
        const result: SearchAllResponse =
          await getAllJobsForLoggedIn(apiFilters);
        jobData = result.jobDtoList || [];
        newTotalElements = result.totalElements || 0;
      } else {
        const result: SearchAllResponse = await getAllJobs(apiFilters);
        jobData = result.jobDtoList || [];
        newTotalElements = result.totalElements || 0;
      }

      setJobs(jobData);
      setTotalElements(newTotalElements);
      setTotalPages(Math.max(1, Math.ceil(newTotalElements / 10)));
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
    // 초기 데이터로 채워져 있을 때는 첫 렌더에서는 불필요한 호출을 피함
    if (
      initialJobs.length === 0 ||
      debouncedSearchKeyword ||
      filters.selectedDistricts.length > 0 ||
      filters.employmentType.length > 0 ||
      filters.jobCategory.length > 0 ||
      activeTab !== (isLoggedIn ? 'custom' : 'all')
    ) {
      fetchJobs(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isLoggedIn, filters, debouncedSearchKeyword]);

  // 페이지 변경 시 데이터 로드
  useEffect(() => {
    if (currentPage > 1) {
      fetchJobs(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const convertToJobCardFormat = (job: AllResponse | JobResponse) => {
    if ('jobTitle' in job) {
      return {
        id: job.jobId,
        jobId: job.jobId.toString(),
        companyName: job.companyName,
        companyLogo: (job as any).imageUrl || (job as any).companyLogo,
        jobTitle: job.jobTitle,
        jobCategory: job.jobCategory,
        workLocation: job.workLocation,
        employmentType: job.employmentType,
        salary:
          (job as { wage?: string }).wage || (job as any).salary || '급여 미정',
        workPeriod:
          (job as { workTime?: string }).workTime ||
          (job as any).workPeriod ||
          '근무기간 미정',
        experience: (job as any).experience || '경력 무관',
        requiredSkills: (job as any).requiredSkills || '',
        preferredSkills: (job as any).preferredSkills || '',
        postingDate: (job as any).postingDate,
        closingDate: job.closingDate,
        applyLink: (job as any).applyLink || '#',
        requiredDocuments: (job as any).requiredDocuments,
        jobRecommendScore: (job as any).score || null,
        isScrap: (job as any).isBookmark,
      };
    } else {
      return {
        id: parseInt(job.jobId) || 0,
        jobId: job.jobId,
        companyName: job.companyName,
        companyLogo: (job as any).imageUrl || '',
        jobTitle: job.keyword,
        jobCategory: '',
        workLocation: job.workLocation,
        employmentType: '',
        salary: '',
        workPeriod: '',
        experience: '',
        requiredSkills: '',
        preferredSkills: '',
        postingDate: '',
        closingDate: job.closingDate,
        applyLink: '',
        requiredDocuments: undefined,
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
                    key={(job as any).jobId || index}
                    job={convertToJobCardFormat(job)}
                    onToggleScrap={toggleScrap}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-6 flex-1">
                {jobs.slice(Math.ceil(jobs.length / 2)).map((job, index) => (
                  <JobCard
                    key={
                      (job as any).jobId || index + Math.ceil(jobs.length / 2)
                    }
                    job={convertToJobCardFormat(job)}
                    onToggleScrap={toggleScrap}
                  />
                ))}
              </div>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 mb-8">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &lt;&lt;
                </button>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &lt;
                </button>
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
                      className={`min-w-[40px] px-4 py-2 rounded-lg border font-medium ${currentPage === pageNum ? 'bg-primary-90 text-white border-primary-90 shadow-md' : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &gt;
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
