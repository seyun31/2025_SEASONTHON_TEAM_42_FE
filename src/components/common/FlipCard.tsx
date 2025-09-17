'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiStar } from 'react-icons/hi';
import { PiStarThin } from 'react-icons/pi';

interface FlipCardProps {
  jobTitle: string;
  jobDescription: string;
  recommendationScore: number;
  onJobPostingClick: () => void;
  jobImage?: string;
  strengths?: {
    title: string;
    percentage: number;
    description: string;
  };
}

export default function FlipCard({
  jobTitle,
  jobDescription,
  recommendationScore,
  onJobPostingClick,
  jobImage,
  strengths,
}: FlipCardProps) {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isScrap, setIsScrap] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleToggleScrap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsScrap(!isScrap);
  };

  return (
    <div
      className="flip-card relative cursor-pointer w-96 h-[538px] flex-shrink-0 rounded-[24px] border-4 border-[#C7D6CC] bg-white shadow-[0_10px_10px_0_rgba(0,66,11,0.15)] hover:shadow-[0_15px_20px_0_rgba(0,66,11,0.25)] transition-all duration-300"
      style={{
        aspectRatio: '109/169',
      }}
      onClick={handleCardClick}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 앞면 - 직업 정보 카드 */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden rounded-[24px] bg-white relative overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* 상단: 직업 이미지 배경 */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/assets/Icons/FlipCard_bg.png)',
            }}
          >
            {/* 직업 이미지가 있다면 오버레이로 표시 */}
            {jobImage && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${jobImage})`,
                }}
              />
            )}
          </div>

          {/* 하단: 직업 정보 텍스트 - 이미지 위에 오버레이 */}
          <div className="absolute bottom-0 left-0 right-0 p-6 w-full h-[218px] bg-gradient-to-b from-transparent to-black">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white self-stretch text-[32px] font-semibold leading-[140%] tracking-[-0.8px]">
                  {jobTitle}
                </h3>
                <button
                  onClick={handleToggleScrap}
                  className={`text-[45px] transition-all duration-300 hover:scale-110 ml-2 ${
                    isScrap ? 'text-gray-400' : 'text-yellow-400'
                  }`}
                >
                  {isScrap ? <PiStarThin /> : <HiStar />}
                </button>
              </div>
              <p className="text-lg text-gray-20 leading-relaxed">
                {jobDescription}
              </p>
            </div>
          </div>
        </div>

        {/* 뒷면 - AI 직업 추천도 카드 */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden rounded-[24px] bg-white rotate-y-180 overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-full p-6 flex flex-col justify-between">
            {/* 상단: 제목 */}
            <div className="flex justify-center items-center">
              <h4 className="text-2xl font-semibold text-gray-800 mt-2">
                AI 직업 추천도
              </h4>
            </div>

            {/* 중간: 추천 점수와 설명 */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              {/* 추천 점수 */}
              <div className="text-center mb-4">
                <div className="text-[100px] font-bold mb-2">
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      background:
                        'linear-gradient(270deg, #E1DC53 3.6%, #9FC2FF 98.32%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {recommendationScore}%
                  </span>
                </div>
              </div>

              {/* 설명 텍스트 */}
              <div className="text-center mb-4 max-w-full overflow-hidden">
                {strengths && (
                  <p className="text-sm leading-relaxed text-gray-700 break-words px-2">
                    {strengths.description}
                  </p>
                )}
              </div>
            </div>

            {/* 하단: 채용공고 확인 버튼 */}
            <div className="mt-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onJobPostingClick();
                  router.push('/job-postings');
                }}
                className="w-full bg-primary-90 hover:bg-green-600 text-xl text-white font-medium py-3 px-4 rounded-2xl transition-colors duration-200"
              >
                채용공고 확인하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
