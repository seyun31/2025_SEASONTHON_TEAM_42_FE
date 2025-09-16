'use client';

import EducationCard from '@/components/features/job/EducationCard';
import SearchBar from '@/components/ui/SearchBar';
import EducationTab from '@/components/ui/EducationTab';
import EducationFilter from '@/components/ui/EducationFilter';
import JobCardSkeleton from '@/components/ui/JobCardSkeleton';
import Footer from '@/components/layout/Footer';
import { educationRecommendations } from '@/data/educationData';
import { useState, useEffect } from 'react';
import { getUserData, getAccessToken } from '@/lib/auth';
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

        // 임시로 mock 데이터 사용 (실제 API 연동 시 교체)
        const educationData = educationRecommendations.map((edu, index) => ({
          id: edu.id,
          trprId: edu.id,
          title: edu.institutionName,
          subTitle: edu.description,
          institution: edu.institutionName,
          address: edu.location,
          traStartDate: '20250101',
          traEndDate: '20251201',
          trainTarget: '취업준비생,직장인',
          contents: edu.description,
          certificate: '자격증,수료증',
          grade: 'A급',
          regCourseMan: '30명',
          courseMan: '30명',
          realMan: '25명',
          yardMan: '30명',
          telNo: '02-1234-5678',
          stdgScor: '4.5',
          eiEmplCnt3: '20',
          eiEmplRate3: '80%',
          eiEmplCnt3Gt10: '15',
          eiEmplRate6: '75%',
          ncsCd: 'NCS001',
          trprDegr: '1',
          instCd: 'INST001',
          trngAreaCd: 'AREA001',
          trainTargetCd: 'TARGET001',
          trainstCstId: 'COST001',
          subTitleLink: '#',
          titleLink: '#',
          titleIcon: '/default-profile.png',
          isBookmark: false,
          recommendScore: Math.floor(Math.random() * 40) + 60, // 60-100 사이 랜덤
        }));

        console.log(
          'EducationPrograms - Educations fetched:',
          educationData.length
        );
        setEducations(educationData);
      } catch (error) {
        console.error('Error fetching educations:', error);
        // 에러 시 mock 데이터 사용
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
                {educations
                  .slice(0, Math.ceil(educations.length / 2))
                  .map((education, index) => (
                    <EducationCard
                      key={education.trprId || index}
                      education={education}
                      onToggleBookmark={toggleFavorite}
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
