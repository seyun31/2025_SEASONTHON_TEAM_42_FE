'use client';

import Footer from '@/components/layout/Footer';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function HeartListsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get('tab');

  const handleTabClick = (tabName: string) => {
    router.push(`/heart-lists?tab=${tabName}`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="max-w-[1200px] mx-auto px-4 md:px-0">
          {/* 타이틀 */}
          <h2 className="hidden md:block text-title-xlarge text-black text-left mb-18">
            관심 목록
          </h2>

          {/* 데스크탑 탭 영역 */}
          <div className="hidden lg:flex gap-6 mb-6">
            <div
              className={`px-4 py-2 ${tab === 'jobs' ? 'border-b-3 border-primary-90' : ''}`}
            >
              <button
                className={`pb-2 text-title-xlarge text-left ${tab === 'jobs' ? 'text-black' : 'text-gray-50 hover:text-black'}`}
                onClick={() => handleTabClick('jobs')}
              >
                채용 공고
              </button>
            </div>
            <div
              className={`px-4 py-2 ${tab === 'education' ? 'border-b-3 border-primary-90' : ''}`}
            >
              <button
                className={`pb-2 text-title-xlarge text-left ${tab === 'education' ? 'text-black' : 'text-gray-50 hover:text-black'}`}
                onClick={() => handleTabClick('education')}
              >
                교육 공고
              </button>
            </div>
          </div>

          {/* 모바일 탭 영역 */}
          <div className="flex gap-6 mb-6 mt-6 lg:hidden">
            <div
              className={`px-4 py-2 ${tab === 'jobs' ? 'border-b-3 border-primary-90' : ''}`}
            >
              <button
                className={`pb-2 text-xl text-left ${tab === 'jobs' ? 'text-black' : 'text-gray-50 hover:text-black'}`}
                onClick={() => handleTabClick('jobs')}
              >
                채용 공고
              </button>
            </div>
            <div
              className={`px-4 py-2 ${tab === 'education' ? 'border-b-3 border-primary-90' : ''}`}
            >
              <button
                className={`pb-2 text-xl text-left ${tab === 'education' ? 'text-black' : 'text-gray-50 hover:text-black'}`}
                onClick={() => handleTabClick('education')}
              >
                교육 공고
              </button>
            </div>
          </div>

          {/* 관심 목록 콘텐츠 영역 */}
          {tab && (
            <div className="flex gap-4 justify-center flex-wrap">
              {/* 카드 컴포넌트들 */}
              <div className="text-center py-16 w-full">
                <p className="text-gray-60 text-lg">
                  {tab === 'jobs'
                    ? '스크랩한 채용 공고가 없습니다.'
                    : '스크랩한 교육 공고가 없습니다.'}
                </p>
                <p className="text-gray-50 text-sm mt-2">
                  {tab === 'jobs'
                    ? '채용 공고에서 원하는 공고를 스크랩하세요!'
                    : '교육 공고에서 원하는 공고를 스크랩하세요!'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function HeartListsPage() {
  return (
    <Suspense fallback={<div></div>}>
      <HeartListsContent />
    </Suspense>
  );
}
