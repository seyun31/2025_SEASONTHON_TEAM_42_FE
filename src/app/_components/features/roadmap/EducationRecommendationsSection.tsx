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
    // 같은 카드를 클릭하면 닫기
    if (openCardId === educationId) {
      setOpenCardId(null);
      return;
    }

    // 다른 카드가 열려있으면 먼저 닫고, 애니메이션 후에 새 카드 열기
    if (openCardId !== null) {
      setOpenCardId(null);
      setTimeout(() => {
        setOpenCardId(educationId);
      }, 300); // 닫는 애니메이션 시간
    } else {
      // 열려있는 카드가 없으면 바로 열기
      setOpenCardId(educationId);
    }
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <EducationCardSkeleton key={index} />
            ))}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {educations.slice(0, 8).map((education, index) => {
              const cardId =
                education.educationId?.toString() || education.trprId;
              const isOpen = openCardId === cardId;
              return (
                <EducationCard
                  key={education.trprId || index}
                  education={education}
                  onToggleBookmark={toggleBookmark}
                  isOpen={isOpen}
                  onToggle={handleCardToggle}
                />
              );
            })}
          </div>
        ) : (
          <EmptyEducations isLoggedIn={isLoggedIn} activeTab="custom" />
        )}
      </div>
    </section>
  );
}
