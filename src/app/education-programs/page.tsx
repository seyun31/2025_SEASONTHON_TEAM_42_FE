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
} from '@/lib/api/jobApi';
import { EducationSummary } from '@/types/job';

export default function EducationPrograms() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'custom' | 'all'>('custom');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [educations, setEducations] = useState<EducationSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

    console.log('EducationPrograms - Login check:', {
      userData,
      token,
      loggedIn,
    });
    setIsLoggedIn(loggedIn);

    // 비로그인 시 전체교육 탭으로 설정
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

  // 탭 변경 시 데이터 로드
  useEffect(() => {
    const fetchEducations = async () => {
      try {
        console.log('EducationPrograms - Fetching educations:', {
          activeTab,
          isLoggedIn,
          filters,
          debouncedSearchKeyword,
        });
        setIsLoading(true);

        let educationData: EducationSummary[] = [];

        if (isLoggedIn) {
          // 로그인 시
          if (activeTab === 'custom') {
            // 맞춤 교육: /education/recommend API 사용
            console.log(
              'EducationPrograms - Fetching recommended educations...'
            );
            educationData = await getRecommendedEducations();
            console.log(
              'EducationPrograms - Recommended educations result:',
              educationData
            );
          } else {
            // 전체 교육: /education/hrd-course API 사용
            console.log('EducationPrograms - Fetching HRD educations...');
            console.log('EducationPrograms - HRD API params:', {
              keyword: debouncedSearchKeyword || undefined,
              pageNo: 1,
              pageSize: 20,
              startYmd: '20250101',
              endYmd: '20251231',
            });
            educationData = await getHrdEducations({
              keyword: debouncedSearchKeyword || undefined,
              pageNo: 1,
              pageSize: 20,
              startYmd: '20250101',
              endYmd: '20251231',
            });
            console.log(
              'EducationPrograms - HRD educations result:',
              educationData
            );
          }
        } else {
          // 비로그인 시: /education/all/anonymous API 사용
          console.log('EducationPrograms - Fetching anonymous educations...');
          educationData = await getAllEducationsAnonymous({
            keyword: debouncedSearchKeyword || undefined,
            workLocation:
              filters.selectedDistricts.length > 0
                ? filters.selectedDistricts.join(',')
                : undefined,
          });
          console.log(
            'EducationPrograms - Anonymous educations result:',
            educationData
          );
        }

        console.log(
          'EducationPrograms - Final educations fetched:',
          educationData.length,
          educationData
        );

        // 데이터가 제대로 있는지 확인
        if (educationData.length > 0) {
          console.log(
            'EducationPrograms - First education item:',
            educationData[0]
          );
        } else {
          console.log('EducationPrograms - No education data received');
        }

        // null이나 빈 배열인 경우 처리
        if (!educationData || educationData.length === 0) {
          console.log(
            'EducationPrograms - No educations found, setting empty array'
          );
          setEducations([]);
          return;
        }

        setEducations(educationData);
      } catch (error) {
        console.error('Error fetching educations:', error);
        // 에러 시 빈 배열로 설정
        setEducations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEducations();
  }, [activeTab, isLoggedIn, filters, debouncedSearchKeyword]);

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

            {/* 빈 상태 처리 */}
            {educations.length === 0 ? (
              <EmptyEducations isLoggedIn={isLoggedIn} activeTab={activeTab} />
            ) : (
              <div className="flex flex-col md:flex-row gap-6 mt-12">
                {(() => {
                  console.log(
                    'EducationPrograms - Rendering educations:',
                    educations.length,
                    educations
                  );
                  return null;
                })()}
                <div className="flex flex-col gap-6 flex-1">
                  {educations
                    .slice(0, Math.ceil(educations.length / 2))
                    .map((education, index) => {
                      console.log(
                        `EducationPrograms - Rendering education ${index}:`,
                        education
                      );
                      return (
                        <EducationCard
                          key={education.trprId || index}
                          education={education}
                          onToggleBookmark={toggleFavorite}
                        />
                      );
                    })}
                </div>
                <div className="flex flex-col gap-6 flex-1">
                  {educations
                    .slice(Math.ceil(educations.length / 2))
                    .map((education, index) => {
                      console.log(
                        `EducationPrograms - Rendering education ${index + Math.ceil(educations.length / 2)}:`,
                        education
                      );
                      return (
                        <EducationCard
                          key={
                            education.trprId ||
                            index + Math.ceil(educations.length / 2)
                          }
                          education={education}
                          onToggleBookmark={toggleFavorite}
                        />
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
