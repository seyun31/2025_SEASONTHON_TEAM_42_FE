'use client';

import EducationCard from '@/components/features/job/EducationCard';
import EmptyEducations from '@/components/features/job/EmptyEducations';
import SearchBar from '@/components/ui/SearchBar';
import EducationTab from '@/components/ui/EducationTab';
import EducationFilter from '@/components/ui/EducationFilter';
import EducationCardSkeleton from '@/components/ui/EducationCardSkeleton';
import Footer from '@/components/layout/Footer';
import { useState, useEffect } from 'react';
import { getUserData, getAccessToken } from '@/lib/auth';
import {
  getRecommendedEducations,
  getAllEducationsAnonymous,
  getHrdEducations,
  getEducationBookmarks,
} from '@/lib/api/jobApi';
import { EducationSummary } from '@/types/job';

export default function EducationPrograms() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'custom' | 'all'>('custom');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false);
  const [educations, setEducations] = useState<EducationSummary[]>([]);
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
    educationType: string[];
    educationCategory: string[];
  }>({
    selectedRegion: '',
    selectedDistricts: [],
    educationType: [],
    educationCategory: [],
  });

  // 초기 로그인 상태 확인 및 데이터 로드
  useEffect(() => {
    const userData = getUserData();
    const token = getAccessToken();
    const loggedIn = !!(userData?.name && token);

    setIsLoggedIn(loggedIn);
    setIsAuthChecked(true);

    // 비로그인 시 전체교육 탭으로 설정, 로그인 시 맞춤교육으로 설정
    if (!loggedIn) {
      setActiveTab('all');
    } else {
      setActiveTab('custom');
    }

    // 로그인된 경우 찜 목록 로드
    if (loggedIn) {
      loadBookmarks();
    }
  }, []);

  // 찜 목록 로드 함수
  const loadBookmarks = async () => {
    try {
      const bookmarkIds = await getEducationBookmarks();
      setFavorites(new Set(bookmarkIds));
    } catch (error) {
      console.error('Error loading education bookmarks:', error);
    }
  };

  // 검색어 디바운싱 (500ms 지연)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // 데이터 로드 함수
  const fetchEducations = async (page: number = 1) => {
    try {
      setIsLoading(true);
      let educationData: EducationSummary[] = [];
      let totalElements = 0;

      if (isLoggedIn) {
        // 로그인 시
        if (activeTab === 'custom') {
          // 맞춤 교육: /education/recommend API 사용
          educationData = await getRecommendedEducations();
          totalElements = educationData.length; // 맞춤 교육은 페이지네이션이 없을 수 있음
        } else {
          // 전체 교육: /education/hrd-course API 사용
          const result = await getHrdEducations({
            keyword: debouncedSearchKeyword || undefined,
            pageNo: page,
            pageSize: 10,
            startYmd: '20250101',
            endYmd: '20251231',
          });
          // EducationDto를 EducationSummary 형식으로 변환
          educationData = (result.educationDtoList || []).map((edu) => ({
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
          }));
          totalElements = result.totalElements || 0;
        }
      } else {
        // 비로그인 시: /education/all/anonymous API 사용
        const result = await getAllEducationsAnonymous({
          keyword: debouncedSearchKeyword || undefined,
          startYmd: '',
          endYmd: '',
        });
        // EducationDto를 EducationSummary 형식으로 변환
        educationData = (result.educationDtoList || []).map((edu) => ({
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
        }));
        totalElements = result.totalElements || 0;
      }

      setEducations(educationData);
      setTotalElements(totalElements);
      setTotalPages(Math.ceil(totalElements / 10));
    } catch (error) {
      console.error('Error fetching educations:', error);
      setEducations([]);
      setTotalElements(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // 탭, 필터, 검색어 변경 시 첫 페이지로 데이터 로드
  useEffect(() => {
    if (!isAuthChecked) return;

    setCurrentPage(1);
    fetchEducations(1);
  }, [activeTab, isLoggedIn, filters, debouncedSearchKeyword, isAuthChecked]);

  // 페이지 변경 시 데이터 로드
  useEffect(() => {
    if (currentPage > 1 && isAuthChecked) {
      fetchEducations(currentPage);
    }
  }, [currentPage]);

  const toggleFavorite = (educationId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(educationId)) {
      newFavorites.delete(educationId);
    } else {
      newFavorites.add(educationId);
    }
    setFavorites(newFavorites);
  };

  if (isLoading) {
    return (
      <div>
        <main className="min-h-screen bg-white">
          <section className="w-full px-4 py-8">
            <div className="max-w-[1200px] mx-auto">
              <SearchBar />

              <EducationFilter onFilterChange={setFilters} />

              {isLoggedIn && (
                <EducationTab
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  isLoggedIn={isLoggedIn}
                />
              )}

              <div className="flex flex-col md:flex-row gap-6 mt-12">
                <div className="flex flex-col gap-6 flex-1">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <EducationCardSkeleton key={index} />
                  ))}
                </div>
                <div className="flex flex-col gap-6 flex-1">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <EducationCardSkeleton key={index + 4} />
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

            <EducationFilter onFilterChange={setFilters} />

            {isLoggedIn && (
              <EducationTab
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isLoggedIn={isLoggedIn}
              />
            )}

            {/* 빈 상태 처리 - 로그인 상태에서만 표시 */}
            {educations.length === 0 && isLoggedIn ? (
              <EmptyEducations isLoggedIn={isLoggedIn} activeTab={activeTab} />
            ) : educations.length > 0 ? (
              <>
                <div className="flex flex-col md:flex-row gap-6 mt-12">
                  <div className="flex flex-col gap-6 flex-1">
                    {educations
                      .slice(0, Math.ceil(educations.length / 2))
                      .map((education, index) => (
                        <EducationCard
                          key={education.trprId || index}
                          education={education}
                          onToggleBookmark={toggleFavorite}
                          isBookmarked={favorites.has(education.trprId || '')}
                        />
                      ))}
                  </div>
                  <div className="flex flex-col gap-6 flex-1">
                    {educations
                      .slice(Math.ceil(educations.length / 2))
                      .map((education, index) => (
                        <EducationCard
                          key={
                            education.trprId ||
                            index + Math.ceil(educations.length / 2)
                          }
                          education={education}
                          onToggleBookmark={toggleFavorite}
                          isBookmarked={favorites.has(education.trprId || '')}
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
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-2.5 xs:px-3 md:px-4 lg:px-4 py-1.5 xs:py-1.5 md:py-2 lg:py-2 text-xs xs:text-sm md:text-base lg:text-base rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          className={`min-w-[32px] xs:min-w-[36px] md:min-w-[40px] lg:min-w-[40px] px-2.5 xs:px-3 md:px-4 lg:px-4 py-1.5 xs:py-1.5 md:py-2 lg:py-2 text-xs xs:text-sm md:text-base lg:text-base rounded-lg border font-medium ${
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
                      className="px-2.5 xs:px-3 md:px-4 lg:px-4 py-1.5 xs:py-1.5 md:py-2 lg:py-2 text-xs xs:text-sm md:text-base lg:text-base rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      &gt;
                    </button>

                    {/* 마지막 페이지 버튼 */}
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-2 xs:px-2 md:px-3 lg:px-3 py-1.5 xs:py-1.5 md:py-2 lg:py-2 text-xs xs:text-sm md:text-base lg:text-base rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
