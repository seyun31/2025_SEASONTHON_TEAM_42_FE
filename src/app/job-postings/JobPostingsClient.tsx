'use client';

import JobCard from '@/components/features/job/JobCard';
import SearchBar from '@/components/ui/SearchBar';
import JobTab from '@/components/ui/JobTab';
import JobCardSkeleton from '@/components/ui/JobCardSkeleton';
import JobFilter from '@/components/ui/JobFilter';
import Footer from '@/components/layout/Footer';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoggedIn = isLoggedInInitial;

  // URL에서 초기 상태 파싱
  const getInitialTab = (): 'custom' | 'all' => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'recommend' || tabParam === 'custom') return 'custom';
    if (tabParam === 'all') return 'all';
    return isLoggedInInitial ? 'custom' : 'all';
  };

  const getInitialPage = (): number => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam) : 1;
  };

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'custom' | 'all'>(getInitialTab());
  const [jobs, setJobs] = useState<(AllResponse | JobResponse)[]>(initialJobs);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(getInitialPage());
  const [totalElements, setTotalElements] =
    useState<number>(initialTotalElements);
  const [totalPages, setTotalPages] = useState<number>(
    Math.max(1, Math.ceil((initialTotalElements || initialJobs.length) / 10))
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

  // URL 업데이트 함수
  const updateURL = (tab: 'custom' | 'all', page: number) => {
    const params = new URLSearchParams();
    if (tab === 'custom') {
      params.set('tab', 'recommend');
    } else {
      params.set('tab', 'all');
      params.set('page', page.toString());
    }
    router.push(`/job-postings?${params.toString()}`, { scroll: false });
  };

  // 탭 변경 핸들러 -> useEffect가 activeTab 변경을 감지하여 fetchJobs 호출
  const handleTabChange = (tab: 'custom' | 'all') => {
    setActiveTab(tab);
    setCurrentPage(1);
    updateURL(tab, 1);
  };

  // 페이지 변경 핸들러 -> useEffect가 currentPage 변경을 감지하여 fetchJobs 호출
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(activeTab, page);
  };

  // 검색어 디바운싱 -> 사용자가 타이핑을 멈춘 후 실제 검색이 실행될 수 있게 함
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
    // 탭이나 필터가 변경되면 항상 데이터를 다시 가져옴
    fetchJobs(1);
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
        companyLogo: job.imageUrl,
        jobTitle: job.jobTitle,
        jobCategory: job.jobCategory,
        workLocation: job.workLocation,
        employmentType: job.employmentType,
        salary: job.wage || '급여 미정',
        workPeriod: job.workTime || '근무기간 미정',
        experience: '경력 무관',
        requiredSkills: '',
        preferredSkills: '',
        postingDate: job.postingDate,
        closingDate: job.closingDate,
        applyLink: '#',
        requiredDocuments: job.requiredDocuments,
        jobRecommendScore: job.score || null,
        isScrap: job.isBookmark,
      };
    } else {
      return {
        id: parseInt(job.jobId) || 0,
        jobId: job.jobId,
        companyName: job.companyName,
        companyLogo: job.imageUrl || '',
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
                  onTabChange={handleTabChange}
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
                onTabChange={handleTabChange}
                isLoggedIn={isLoggedIn}
              />
            )}
            <div className="flex flex-col md:flex-row gap-6 mt-12">
              <div className="flex flex-col gap-6 flex-1">
                {jobs.slice(0, Math.ceil(jobs.length / 2)).map((job, index) => (
                  <JobCard
                    key={
                      ('jobId' in job && typeof job.jobId === 'number'
                        ? job.jobId
                        : job.jobId) || index
                    }
                    job={convertToJobCardFormat(job)}
                    onToggleScrap={toggleScrap}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-6 flex-1">
                {jobs.slice(Math.ceil(jobs.length / 2)).map((job, index) => (
                  <JobCard
                    key={
                      ('jobId' in job && typeof job.jobId === 'number'
                        ? job.jobId
                        : job.jobId) || index + Math.ceil(jobs.length / 2)
                    }
                    job={convertToJobCardFormat(job)}
                    onToggleScrap={toggleScrap}
                  />
                ))}
              </div>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1 sm:gap-2 mt-12 mb-8">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
                >
                  &lt;&lt;
                </button>
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
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
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[32px] sm:min-w-[40px] px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border font-medium cursor-pointer text-sm sm:text-base ${currentPage === pageNum ? 'bg-primary-90 text-white border-primary-90 shadow-md' : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
                >
                  &gt;
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
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
