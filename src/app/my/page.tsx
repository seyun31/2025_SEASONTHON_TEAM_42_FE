'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getUserData } from '@/lib/auth';
import FlipCard from '@/components/common/FlipCard';
import Footer from '@/components/layout/Footer';

export default function My() {
  const [userData, setUserData] = useState<{
    userId: number;
    name: string;
    socialProvider: string;
    socialId: string;
    email: string;
    profileImage: string;
  } | null>(null);

  useEffect(() => {
    const user = getUserData();
    if (user) {
      setUserData(user);
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

            <div className="flex justify-center">
              <div className="h-[538px]">
                <FlipCard
                  jobTitle="직업명"
                  jobDescription="직업 한 줄 소개"
                  recommendationScore={100}
                  strengths={{
                    title: '강점',
                    percentage: 80,
                    description: `OO직업은 섬세한 손재주를 요하는 직업으로 OOO한 경험을 바탕으로 우수한 손재주를 지닌 ${userData?.name || '사용자'}님에게 적합해요.`,
                  }}
                  workingConditions={{
                    title: '근무조건',
                    percentage: 60,
                    description: `OO직업은 주로 9-18시 사이에 근무가 이루어지며, 재택근무가 가능한 경우가 많아 ${userData?.name || '사용자'}님이 원하시는 근무 시간 조건에 적합해요.`,
                  }}
                  preferences={{
                    title: '자격요건',
                    percentage: 80,
                    description: `OO직업은 OOO 자격증을 보유하고 있는 사람을 우대해요. 시간이 걸리더라도 교육을 수강한 후 전문성 있는 직업에 취업하고자 하는 ${userData?.name || '사용자'}님의 희망사항에 적합해요!`,
                  }}
                  userName={userData?.name || '사용자'}
                  onJobPostingClick={() => {
                    // 채용공고 확인하기 클릭 시 동작
                    console.log('채용공고 확인하기');
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
