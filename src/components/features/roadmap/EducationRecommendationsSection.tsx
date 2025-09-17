'use client';

import { useState, useEffect } from 'react';
import EducationCard from '@/components/features/job/EducationCard';
import JobCardSkeleton from '@/components/ui/JobCardSkeleton';
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

  useEffect(() => {
    const userData = getUserData();
    if (userData?.name) {
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

        if (isLoggedIn) {
          // 로그인 시: /education/recommend API 사용
          educationData = await getRecommendedEducations();
        } else {
          // 비로그인 시: /education/all/anonymous API 사용
          educationData = await getAllEducationsAnonymous();
        }

        console.log(
          'EducationRecommendationsSection - Education courses fetched:',
          educationData.length,
          educationData
        );

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
  }, [isLoggedIn]);

  const toggleBookmark = (educationId: string) => {
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

          <div className="flex flex-row gap-6">
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
            <div className="flex flex-col gap-6 flex-1">
              {educations.slice(0, 4).map((education, index) => (
                <EducationCard
                  key={education.trprId || index}
                  education={education}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>
            <div className="flex flex-col gap-6 flex-1">
              {educations.slice(4, 8).map((education, index) => (
                <EducationCard
                  key={education.trprId || index + 4}
                  education={education}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-60 text-lg mb-4">
                추천할 교육과정이 없습니다.
              </p>
              <p className="text-gray-50 text-sm">
                다른 검색 조건을 시도해보세요.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
