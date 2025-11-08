'use client';

import { useState, useEffect } from 'react';
import EducationCard from '@/components/features/job/EducationCard';
import EmptyEducations from '@/components/features/job/EmptyEducations';
import EducationCardSkeleton from '@/components/ui/EducationCardSkeleton';
import { getUserData } from '@/lib/auth';
import {
  getRecommendedEducations,
  getAllEducationsAnonymous,
} from '@/lib/api/jobApi';
import { EducationSummary } from '@/types/job';

export default function EducationRecommendationsSection() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [userName, setUserName] = useState<string>('');
  const [educations, setEducations] = useState<EducationSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  useEffect(() => {
    const userData = getUserData();
    const loggedIn = !!userData?.name;

    if (loggedIn) {
      setUserName(userData.name);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    // 교육과정 데이터 가져오기
    const fetchEducations = async () => {
      try {
        setIsLoading(true);
        console.log(
          'EducationRecommendationsSection - Fetching education courses'
        );

        let educationData: EducationSummary[] = [];

        if (loggedIn) {
          // 로그인 시: /education/recommend API 사용
          educationData = await getRecommendedEducations();
        } else {
          // 비로그인 시: /education/all/anonymous API 사용
          const result = await getAllEducationsAnonymous();
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
        }

        console.log(
          'EducationRecommendationsSection - Education courses fetched:',
          educationData.length,
          educationData
        );

        // null이나 빈 배열인 경우 처리
        if (!educationData || educationData.length === 0) {
          console.log(
            'EducationRecommendationsSection - No educations found, setting empty array'
          );
          setEducations([]);
          return;
        }

        // 8개로 제한
        setEducations(educationData.slice(0, 8));
      } catch (error) {
        console.error('Error fetching education courses:', error);
        // 에러 시 빈 배열로 설정
        setEducations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEducations();
  }, []);

  const toggleBookmark = (educationId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(educationId)) {
      newFavorites.delete(educationId);
    } else {
      newFavorites.add(educationId);
    }
    setFavorites(newFavorites);
  };

  // 카드 토글 핸들러
  const handleCardToggle = (educationId: string) => {
    // educationId를 문자열로 통일
    const educationIdStr = String(educationId);
    const currentOpenId = openCardId ? String(openCardId) : null;

    // 같은 카드를 클릭하면 닫기
    if (currentOpenId === educationIdStr) {
      setOpenCardId(null);
      return;
    }

    // 새로운 카드를 먼저 열고, 다른 카드는 동시에 닫힘 (상태 업데이트는 동시에 가능)
    setOpenCardId(educationIdStr);
  };

  if (isLoading) {
    return (
      <section className="w-full px-4 py-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-4xl font-semibold text-gray-80 text-left items-center">
              {userName
                ? `${userName}님을 위한 오늘의 맞춤 교육 추천`
                : '오늘의 교육 추천'}
            </h2>
            <a
              href="/education-programs"
              className="text-primary-300 hover:text-primary-600 transition-colors"
            >
              더보기
            </a>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* 왼쪽 컬럼 */}
            <div className="flex flex-col gap-6 w-full md:w-[calc(50%-12px)]">
              {Array.from({ length: 4 }).map((_, index) => (
                <EducationCardSkeleton key={index * 2} />
              ))}
            </div>
            {/* 오른쪽 컬럼 */}
            <div className="flex flex-col gap-6 w-full md:w-[calc(50%-12px)]">
              {Array.from({ length: 4 }).map((_, index) => (
                <EducationCardSkeleton key={index * 2 + 1} />
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
          <h2 className="text-2xl md:text-4xl font-semibold text-gray-80 text-left items-center">
            {userName ? (
              <>
                {userName}님을 위한 <br className="md:hidden" /> 오늘의 맞춤
                교육 추천
              </>
            ) : (
              '오늘의 교육 추천'
            )}
          </h2>
          <a
            href="/education-programs"
            className="text-primary-300 hover:text-primary-600 transition-colors"
          >
            더보기
          </a>
        </div>

        {educations.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-6">
            {/* 왼쪽 컬럼 */}
            <div className="flex flex-col gap-6 w-full md:w-[calc(50%-12px)]">
              {educations
                .slice(0, 8)
                .filter((_, index) => index % 2 === 0)
                .map((education, filteredIndex) => {
                  const originalIndex = filteredIndex * 2;
                  const cardId =
                    education.educationId?.toString() ||
                    education.trprId ||
                    originalIndex.toString();
                  const isOpen = openCardId
                    ? String(openCardId) === String(cardId)
                    : false;
                  return (
                    <EducationCard
                      key={education.trprId || originalIndex}
                      education={education}
                      onToggleBookmark={toggleBookmark}
                      isBookmarked={education.isBookmark || false}
                      isOpen={isOpen}
                      onToggle={handleCardToggle}
                    />
                  );
                })}
            </div>
            {/* 오른쪽 컬럼 */}
            <div className="flex flex-col gap-6 w-full md:w-[calc(50%-12px)]">
              {educations
                .slice(0, 8)
                .filter((_, index) => index % 2 === 1)
                .map((education, filteredIndex) => {
                  const originalIndex = filteredIndex * 2 + 1;
                  const cardId =
                    education.educationId?.toString() ||
                    education.trprId ||
                    originalIndex.toString();
                  const isOpen = openCardId
                    ? String(openCardId) === String(cardId)
                    : false;
                  return (
                    <EducationCard
                      key={education.trprId || originalIndex}
                      education={education}
                      onToggleBookmark={toggleBookmark}
                      isBookmarked={education.isBookmark || false}
                      isOpen={isOpen}
                      onToggle={handleCardToggle}
                    />
                  );
                })}
            </div>
          </div>
        ) : (
          <EmptyEducations isLoggedIn={isLoggedIn} activeTab="custom" />
        )}
      </div>
    </section>
  );
}
