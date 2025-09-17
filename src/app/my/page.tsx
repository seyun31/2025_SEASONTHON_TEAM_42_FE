'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getUserData } from '@/lib/auth';
import Footer from '@/components/layout/Footer';
import FlipCard from '@/components/common/FlipCard';

interface Occupation {
  imageUrl: string | null;
  occupationName: string;
  description: string;
  strength: string;
  score: string;
  memberOccupationId: number;
  isBookmark: boolean;
}

export default function My() {
  const [userData, setUserData] = useState<{
    userId: number;
    name: string;
    socialProvider: string;
    socialId: string;
    email: string;
    profileImage: string;
  } | null>(null);

  const [bookmarkedJobs, setBookmarkedJobs] = useState<Occupation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookmarkedJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat/jobs/history/job-card');
      const data = await response.json();

      if (data.result === 'SUCCESS' && data.data?.occupationList) {
        setBookmarkedJobs(data.data.occupationList);
      } else {
        console.error('북마크된 직업 조회 실패:', data.error);
        setBookmarkedJobs([]);
      }
    } catch (error) {
      console.error('API 호출 실패:', error);
      setBookmarkedJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const user = getUserData();
    if (user) {
      setUserData(user);
      fetchBookmarkedJobs();
    }
  }, []);

  return (
    <div>
      <section className="w-full px-4 py-8">
        <div className="max-w-[1200px] mx-auto">
          {/* 프로필 섹션 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center">
                {userData?.profileImage ? (
                  <Image
                    src={userData.profileImage}
                    alt="프로필 이미지"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-profile.png';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="text-title-xlarge text-gray-80">
                {userData?.name || '사용자'}님의 프로필
              </h3>
            </div>
          </div>

          {/* 추천 직업 카드 섹션 */}
          <div className="mb-8">
            <h3 className="text-title-large text-gray-80 mb-6">
              {userData?.name || '사용자'}님의 추천 직업 카드
            </h3>

            {isLoading ? (
              <div className="flex justify-center items-center h-[538px]">
                <p className="text-gray-60">북마크된 직업을 불러오는 중...</p>
              </div>
            ) : bookmarkedJobs.length > 0 ? (
              <div className="flex gap-4 justify-center flex-wrap">
                {bookmarkedJobs.map((job, index) => (
                  <FlipCard
                    key={job.memberOccupationId || index}
                    jobImage={job.imageUrl || undefined}
                    jobTitle={job.occupationName}
                    jobDescription={job.description}
                    recommendationScore={parseInt(job.score) || 0}
                    strengths={{
                      title: job.strength,
                      percentage: parseInt(job.score) || 0,
                      description: job.strength,
                    }}
                    memberOccupationId={job.memberOccupationId}
                    isBookmark={job.isBookmark}
                    onJobPostingClick={() => {
                      console.log(
                        '채용공고 확인하기 clicked for:',
                        job.occupationName
                      );
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-[538px]">
                <div className="text-center">
                  <p className="text-gray-60 mb-2">
                    아직 북마크된 직업이 없습니다.
                  </p>
                  <p className="text-gray-50 text-sm">
                    AI 채팅에서 직업을 추천받고 별표를 눌러 저장해보세요!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
