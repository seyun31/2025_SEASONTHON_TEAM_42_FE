'use client';

import dynamic from 'next/dynamic';
import JobCard from '@/components/features/job/JobCard';
import JobCardSkeleton from '@/components/ui/JobCardSkeleton';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Lazy load 컴포넌트들
const SearchBar = dynamic(() => import('@/components/ui/SearchBar'), {
  ssr: false,
  loading: () => <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />,
});
const JobFilter = dynamic(
  () =>
    import('@/components/ui/JobFilter').then((mod) => ({
      default: mod.default,
    })),
  { ssr: false }
);
const JobTab = dynamic(() => import('@/components/ui/JobTab'), {
  ssr: false,
});
const Footer = dynamic(() => import('@/components/layout/Footer'), {
  ssr: false,
});

import {
  getRecommendedJobs,
  getAllJobs,
  getAllJobsForLoggedIn,
} from '@/lib/api/jobApi';
import { AllResponse, JobResponse, SearchAllResponse } from '@/types/job';
import { employmentTypeOptions } from '@/components/ui/JobFilter';

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

  const getInitialOpenCard = (): string | null => {
    return searchParams.get('open');
  };

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'custom' | 'all'>(getInitialTab());
  const [openCardId, setOpenCardId] = useState<string | null>(
    getInitialOpenCard()
  );
  const [jobs, setJobs] = useState<(AllResponse | JobResponse)[]>(initialJobs);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(getInitialPage());
  // 카드 렌더링 제한 (초기에는 4개만)
  const [visibleCardCount, setVisibleCardCount] = useState(4);
  // 초기 마운트 추적
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [_totalElements, setTotalElements] =
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
  const updateURL = (
    tab: 'custom' | 'all',
    page: number,
    openCard: string | null = null
  ) => {
    const params = new URLSearchParams();
    if (tab === 'custom') {
      params.set('tab', 'recommend');
    } else {
      params.set('tab', 'all');
      params.set('page', page.toString());
    }
    if (openCard) {
      params.set('open', openCard);
    }
    router.push(`/job-postings?${params.toString()}`, { scroll: false });
  };

  // 카드 토글 핸들러
  const handleCardToggle = (jobId: string) => {
    // jobId를 문자열로 통일
    const jobIdStr = String(jobId);
    const currentOpenId = openCardId ? String(openCardId) : null;

    // 같은 카드를 클릭하면 닫기
    if (currentOpenId === jobIdStr) {
      setOpenCardId(null);
      updateURL(activeTab, currentPage, null);
      return;
    }

    // 새로운 카드를 먼저 열고, 다른 카드는 동시에 닫힘 (상태 업데이트는 동시에 가능)
    setOpenCardId(jobIdStr);
    updateURL(activeTab, currentPage, jobIdStr);
  };

  // 탭 변경 핸들러 -> useEffect가 activeTab 변경을 감지하여 fetchJobs 호출
  const handleTabChange = (tab: 'custom' | 'all') => {
    setIsLoading(true); // 즉시 로딩 상태로 변경
    setJobs([]); // 이전 데이터 클리어
    setVisibleCardCount(4); // 카드 카운트 리셋
    setActiveTab(tab);
    setOpenCardId(null); // 탭 변경 시 열린 카드 초기화
    updateURL(tab, 1, null);
  };

  // 페이지 변경 핸들러 -> useEffect가 currentPage 변경을 감지하여 fetchJobs 호출
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setVisibleCardCount(4); // 카드 카운트 리셋
    setOpenCardId(null); // 페이지 변경 시 열린 카드 초기화
    updateURL(activeTab, page, null);
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

      const isAllTab = activeTab === 'all';

      const apiFilters = isAllTab
        ? {
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
          }
        : {
            page: page - 1,
            size: 10,
          };

      if (!isAllTab && isLoggedIn) {
        jobData = await getRecommendedJobs();
        newTotalElements = jobData.length;
      } else if (isAllTab && isLoggedIn) {
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

  const handleFilterApply = (appliedFilters: typeof filters) => {
    setFilters(appliedFilters);
    setOpenCardId(null);

    if (activeTab !== 'all') {
      setIsLoading(true);
      setJobs([]);
      setActiveTab('all');
      setCurrentPage(1);
      updateURL('all', 1, null);
      return;
    }

    setIsLoading(true);
    setJobs([]);
    updateURL('all', 1, null);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  // 탭 변경 시 첫 페이지로 리셋 및 데이터 로드
  useEffect(() => {
    // 초기 마운트 시에는 SSR 데이터 사용, API 호출 스킵
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }

    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchJobs(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isLoggedIn]);

  // 필터나 검색어 변경 시 (전체공고 탭에서만) 첫 페이지로 리셋 후 데이터 로드
  useEffect(() => {
    if (activeTab !== 'all') return;
    if (isInitialMount) return;

    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchJobs(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, debouncedSearchKeyword]);

  // 페이지 변경 시 데이터 로드
  useEffect(() => {
    // 초기 마운트가 아닐 때만 페이지 변경 API 호출
    if (!isInitialMount) {
      fetchJobs(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // 나머지 카드 점진적 렌더링
  useEffect(() => {
    if (jobs.length > visibleCardCount) {
      const timer = setTimeout(() => {
        setVisibleCardCount((prev) => Math.min(prev + 4, jobs.length));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [jobs.length, visibleCardCount]);

  const toggleScrap = (jobId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(jobId)) {
      newFavorites.delete(jobId);
    } else {
      newFavorites.add(jobId);
    }
    setFavorites(newFavorites);
  };

  const normalizeClosingDate = (
    closingDate: string | null | undefined
  ): string => {
    const raw = (closingDate || '').trim();
    if (!raw) return '';

    // YYYYMMDD 형식을 YYYY-MM-DD로 변환
    if (/^\d{8}$/.test(raw)) {
      const year = raw.slice(0, 4);
      const month = raw.slice(4, 6);
      const day = raw.slice(6, 8);
      return `${year}-${month}-${day}`;
    }

    // 공백이나 특수문자 제거
    let cleaned = raw.replace(/[^\d-]/g, '');

    // 유효한 날짜 형식인지 체크
    if (!/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
      cleaned = '';
    }

    return cleaned || raw;
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
        closingDate: normalizeClosingDate(job.closingDate),
        applyLink: '#',
        requiredDocuments: job.requiredDocuments,
        jobRecommendScore: job.score || null,
        isScrap: job.isBookmark,
        managerPhone: job.managerPhone,
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
        closingDate: normalizeClosingDate(job.closingDate),
        applyLink: '',
        requiredDocuments: undefined,
        jobRecommendScore: job.jobRecommendScore
          ? parseInt(job.jobRecommendScore)
          : null,
        isScrap: job.isBookmark,
      };
    }
  };

  // 왼쪽 컬럼 카드 렌더링 메모이제이션
  const leftColumnCards = useMemo(
    () =>
      jobs
        .slice(0, visibleCardCount)
        .filter((_, index) => index % 2 === 0)
        .map((job, filteredIndex) => {
          const originalIndex = filteredIndex * 2;
          const cardId =
            ('jobId' in job && typeof job.jobId === 'number'
              ? job.jobId.toString()
              : job.jobId) || originalIndex.toString();
          const isOpen = openCardId
            ? String(openCardId) === String(cardId)
            : false;
          return (
            <div
              key={
                ('jobId' in job && typeof job.jobId === 'number'
                  ? job.jobId
                  : job.jobId) || originalIndex
              }
            >
              <JobCard
                job={convertToJobCardFormat(job)}
                onToggleScrap={toggleScrap}
                isOpen={isOpen}
                onToggle={handleCardToggle}
                priority={originalIndex === 0}
              />
            </div>
          );
        }),
    [
      jobs,
      visibleCardCount,
      openCardId,
      convertToJobCardFormat,
      toggleScrap,
      handleCardToggle,
    ]
  );

  // 오른쪽 컬럼 카드 렌더링 메모이제이션
  const rightColumnCards = useMemo(
    () =>
      jobs
        .slice(0, visibleCardCount)
        .filter((_, index) => index % 2 === 1)
        .map((job, filteredIndex) => {
          const originalIndex = filteredIndex * 2 + 1;
          const cardId =
            ('jobId' in job && typeof job.jobId === 'number'
              ? job.jobId.toString()
              : job.jobId) || originalIndex.toString();
          const isOpen = openCardId
            ? String(openCardId) === String(cardId)
            : false;
          return (
            <div
              key={
                ('jobId' in job && typeof job.jobId === 'number'
                  ? job.jobId
                  : job.jobId) || originalIndex
              }
            >
              <JobCard
                job={convertToJobCardFormat(job)}
                onToggleScrap={toggleScrap}
                isOpen={isOpen}
                onToggle={handleCardToggle}
              />
            </div>
          );
        }),
    [
      jobs,
      visibleCardCount,
      openCardId,
      convertToJobCardFormat,
      toggleScrap,
      handleCardToggle,
    ]
  );

  if (isLoading) {
    return (
      <div>
        <main className="min-h-screen bg-white">
          <section className="w-full px-4 py-8">
            <div className="max-w-[1200px] mx-auto">
              <SearchBar />
              {isLoggedIn && <JobFilter onFilterChange={setFilters} />}
              {isLoggedIn && (
                <JobTab
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  isLoggedIn={isLoggedIn}
                />
              )}
              <div className="flex flex-col md:flex-row gap-6 mt-12">
                {/* 왼쪽 컬럼 */}
                <div className="flex flex-col gap-6 w-full md:w-[calc(50%-12px)]">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <JobCardSkeleton key={index * 2} />
                  ))}
                </div>
                {/* 오른쪽 컬럼 */}
                <div className="flex flex-col gap-6 w-full md:w-[calc(50%-12px)]">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <JobCardSkeleton key={index * 2 + 1} />
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
            {activeTab === 'all' && (
              <>
                <SearchBar onSearchChange={setSearchKeyword} />
                {isLoggedIn && <JobFilter onFilterChange={handleFilterApply} />}
                {(debouncedSearchKeyword.trim().length > 0 ||
                  filters.selectedDistricts.length > 0 ||
                  filters.employmentType.length > 0 ||
                  filters.jobCategory.length > 0) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {debouncedSearchKeyword.trim().length > 0 && (
                      <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-gray-10 text-gray-80 rounded-full text-sm md:text-base">
                        <span className="font-medium text-gray-90">검색어</span>
                        <span>{debouncedSearchKeyword}</span>
                      </div>
                    )}

                    {filters.selectedDistricts.map((district) => (
                      <div
                        key={`summary-district-${district}`}
                        className="flex items-center gap-2 px-2 md:px-3 py-1 bg-primary-10 text-primary-90 rounded-full text-sm md:text-base"
                      >
                        <span>{district}</span>
                      </div>
                    ))}

                    {filters.employmentType.map((type) => {
                      const option = employmentTypeOptions.find(
                        (opt) => opt.value === type
                      );
                      if (!option) return null;
                      return (
                        <div
                          key={`summary-employment-${type}`}
                          className="flex items-center gap-2 px-2 md:px-3 py-1 bg-primary-10 text-primary-90 rounded-full text-sm md:text-base"
                        >
                          <span>{option.label}</span>
                        </div>
                      );
                    })}

                    {filters.jobCategory.map((category) => (
                      <div
                        key={`summary-category-${category}`}
                        className="flex items-center gap-2 px-2 md:px-3 py-1 bg-primary-10 text-primary-90 rounded-full text-sm md:text-base"
                      >
                        <span>{category}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {isLoggedIn && (
              <JobTab
                activeTab={activeTab}
                onTabChange={handleTabChange}
                isLoggedIn={isLoggedIn}
              />
            )}
            <div className="flex flex-col md:flex-row gap-6 mt-12">
              {/* 왼쪽 컬럼 */}
              <div className="flex flex-col gap-6 w-full md:w-[calc(50%-12px)]">
                {leftColumnCards}
              </div>
              {/* 오른쪽 컬럼 */}
              <div className="flex flex-col gap-6 w-full md:w-[calc(50%-12px)]">
                {rightColumnCards}
              </div>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1 sm:gap-2 mt-12 mb-8">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-[#B4E6CE] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
                >
                  &lt;&lt;
                </button>
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-[#B4E6CE] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
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
                      className={`min-w-[32px] sm:min-w-[40px] px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border font-medium cursor-pointer text-sm sm:text-base ${currentPage === pageNum ? 'bg-primary-90 text-white border-primary-90 shadow-md' : 'border-gray-300 text-gray-700 hover:bg-[#B4E6CE]'}`}
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
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-[#B4E6CE] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
                >
                  &gt;
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-[#B4E6CE] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
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
