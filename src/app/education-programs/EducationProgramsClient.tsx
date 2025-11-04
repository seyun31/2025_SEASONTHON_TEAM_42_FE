'use client';

import EducationCard from '@/components/features/job/EducationCard';
import EmptyEducations from '@/components/features/job/EmptyEducations';
import SearchBar from '@/components/ui/SearchBar';
import EducationTab from '@/components/ui/EducationTab';
import EducationFilter from '@/components/ui/EducationFilter';
import EducationCardSkeleton from '@/components/ui/EducationCardSkeleton';
import Footer from '@/components/layout/Footer';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  getAllEducationsAnonymous,
  getHrdEducations,
  getRecommendedEducations,
} from '@/lib/api/jobApi';
import { EducationSummary } from '@/types/job';

interface EducationProgramsClientProps {
  initialEducations: EducationSummary[];
  initialTotalElements: number;
  isLoggedInInitial: boolean;
}

export default function EducationProgramsClient({
  initialEducations,
  initialTotalElements,
  isLoggedInInitial,
}: EducationProgramsClientProps) {
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

  const [activeTab, setActiveTab] = useState<'custom' | 'all'>(getInitialTab());
  const [openCardId, setOpenCardId] = useState<string | null>(
    getInitialOpenCard()
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [educations, setEducations] =
    useState<EducationSummary[]>(initialEducations);
  const [currentPage, setCurrentPage] = useState<number>(getInitialPage());
  const [, setTotalElements] = useState<number>(initialTotalElements);
  const [totalPages, setTotalPages] = useState<number>(
    Math.max(
      1,
      Math.ceil((initialTotalElements || initialEducations.length) / 20)
    )
  );
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] =
    useState<string>('');
  const [filters, setFilters] = useState<{
    selectedRegion: string;
    selectedDistricts: string[];
    educationType: string[];
    educationCategory: string[];
  }>({
    selectedRegion: '',
    selectedDistricts: [],
    educationType: [],
    educationCategory: [],
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
    router.push(`/education-programs?${params.toString()}`, { scroll: false });
  };

  // 카드 토글 핸들러
  const handleCardToggle = (educationId: string) => {
    // 같은 카드를 클릭하면 닫기
    if (openCardId === educationId) {
      setOpenCardId(null);
      updateURL(activeTab, currentPage, null);
      return;
    }

    // 다른 카드가 열려있으면 먼저 닫고, 애니메이션 후에 새 카드 열기
    if (openCardId !== null) {
      setOpenCardId(null);
      setTimeout(() => {
        setOpenCardId(educationId);
        updateURL(activeTab, currentPage, educationId);
      }, 300); // 닫는 애니메이션 시간
    } else {
      // 열려있는 카드가 없으면 바로 열기
      setOpenCardId(educationId);
      updateURL(activeTab, currentPage, educationId);
    }
  };

  // 탭 변경 핸들러 -> useEffect가 activeTab 변경을 감지하여 fetchEducations 호출
  const handleTabChange = (tab: 'custom' | 'all') => {
    setIsLoading(true); // 즉시 로딩 상태로 변경
    setEducations([]); // 이전 데이터 클리어
    setActiveTab(tab);
    setOpenCardId(null); // 탭 변경 시 열린 카드 초기화
    updateURL(tab, 1, null);
  };

  // 페이지 변경 핸들러 -> useEffect가 currentPage 변경을 감지하여 fetchEducations 호출
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setOpenCardId(null); // 페이지 변경 시 열린 카드 초기화
    updateURL(activeTab, page, null);
  };

  // 검색어 디바운싱 -> 사용자가 타이핑을 멈춘 후 실제 검색이 실행될 수 있게 함
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearchKeyword(searchKeyword),
      500
    );
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const fetchEducations = async (page: number = 1) => {
    try {
      setIsLoading(true);
      let data: EducationSummary[] = [];
      let newTotalElements = 0;

      if (isLoggedIn) {
        if (activeTab === 'custom') {
          data = await getRecommendedEducations();
          newTotalElements = data.length;
        } else {
          const result = await getHrdEducations({
            keyword: debouncedSearchKeyword || undefined,
            pageNo: page - 1,
            pageSize: 20,
            startYmd: '20250101',
            endYmd: '20251231',
          });
          data = (result.educationDtoList || []).map((edu) => {
            return {
              id: edu.educationId.toString(),
              educationId: edu.educationId,
              trprId: edu.educationId.toString(),
              title: edu.title,
              subTitle: edu.subTitle,
              institution: '',
              address: edu.address,
              traStartDate: edu.traStartDate,
              traEndDate: edu.traEndDate,
              trainTarget: '',
              contents: '',
              certificate: '',
              grade: '',
              regCourseMan: '',
              courseMan: edu.courseMan,
              realMan: '',
              yardMan: '',
              telNo: '',
              stdgScor: '',
              eiEmplCnt3: '',
              eiEmplRate3: '',
              eiEmplCnt3Gt10: '',
              eiEmplRate6: '',
              ncsCd: '',
              trprDegr: edu.trprDegr,
              instCd: '',
              trngAreaCd: '',
              trainTargetCd: '',
              trainstCstId: '',
              subTitleLink: '',
              titleLink: edu.titleLink,
              titleIcon: '',
              imageUrl: edu.imageUrl,
              isBookmark: edu.isBookmark,
              recommendScore: edu.score ?? undefined,
              keyword1: edu.keyword1,
              keyword2: edu.keyword2,
            };
          });
          newTotalElements = result.totalElements || 0;
        }
      } else {
        const result = await getAllEducationsAnonymous({
          keyword: debouncedSearchKeyword || undefined,
          pageNo: page - 1,
          pageSize: 20,
          startYmd: '',
          endYmd: '',
        });
        data = (result.educationDtoList || []).map((edu) => {
          return {
            id: edu.educationId.toString(),
            educationId: edu.educationId,
            trprId: edu.educationId.toString(),
            title: edu.title,
            subTitle: edu.subTitle,
            institution: '',
            address: edu.address,
            traStartDate: edu.traStartDate,
            traEndDate: edu.traEndDate,
            trainTarget: '',
            contents: '',
            certificate: '',
            grade: '',
            regCourseMan: '',
            courseMan: edu.courseMan,
            realMan: '',
            yardMan: '',
            telNo: '',
            stdgScor: '',
            eiEmplCnt3: '',
            eiEmplRate3: '',
            eiEmplCnt3Gt10: '',
            eiEmplRate6: '',
            ncsCd: '',
            trprDegr: edu.trprDegr,
            instCd: '',
            trngAreaCd: '',
            trainTargetCd: '',
            trainstCstId: '',
            subTitleLink: '',
            titleLink: edu.titleLink,
            titleIcon: '',
            imageUrl: edu.imageUrl,
            isBookmark: edu.isBookmark,
            recommendScore: edu.score ?? undefined,
            keyword1: edu.keyword1,
            keyword2: edu.keyword2,
          };
        });
        newTotalElements = result.totalElements || 0;
      }

      setEducations(data);
      setTotalElements(newTotalElements);
      setTotalPages(Math.max(1, Math.ceil(newTotalElements / 20)));
    } catch (_error) {
      setEducations([]);
      setTotalElements(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // 의존성 변경 시 첫 페이지로 리셋 및 데이터 로드
  useEffect(() => {
    // 탭이나 필터가 변경되면 페이지를 1로 리셋하고 데이터 로드
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      // 이미 페이지 1이면 직접 데이터 로드
      fetchEducations(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isLoggedIn, filters, debouncedSearchKeyword]);

  // 페이지 변경 시 로드
  useEffect(() => {
    fetchEducations(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const toggleFavorite = (educationId: string) => {
    // 교육 데이터의 isBookmark 상태를 토글
    setEducations((prevEducations) =>
      prevEducations.map((edu) =>
        edu.trprId === educationId || edu.id === educationId
          ? { ...edu, isBookmark: !edu.isBookmark }
          : edu
      )
    );
  };

  if (isLoading) {
    return (
      <div>
        <main className="min-h-screen bg-white">
          <section className="w-full px-4 py-8">
            <div className="max-w-[1200px] mx-auto">
              <SearchBar borderColor="#9FC2FF" />
              <EducationFilter onFilterChange={setFilters} />
              {isLoggedIn && (
                <EducationTab
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  isLoggedIn={isLoggedIn}
                />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                {Array.from({ length: 8 }).map((_, index) => (
                  <EducationCardSkeleton key={index} />
                ))}
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
            <SearchBar
              onSearchChange={setSearchKeyword}
              borderColor="#9FC2FF"
            />
            <EducationFilter onFilterChange={setFilters} />
            {isLoggedIn && (
              <EducationTab
                activeTab={activeTab}
                onTabChange={handleTabChange}
                isLoggedIn={isLoggedIn}
              />
            )}
            {educations.length === 0 && isLoggedIn ? (
              <EmptyEducations isLoggedIn={isLoggedIn} activeTab={activeTab} />
            ) : educations.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                  {educations.map((education, index) => {
                    const cardId =
                      education.educationId?.toString() || education.trprId;
                    const isOpen = openCardId === cardId;
                    return (
                      <EducationCard
                        key={education.trprId || index}
                        education={education}
                        onToggleBookmark={toggleFavorite}
                        isBookmarked={education.isBookmark || false}
                        isOpen={isOpen}
                        onToggle={handleCardToggle}
                      />
                    );
                  })}
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
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
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
              </>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
