'use client';

import { useState } from 'react';
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
  memberOccupationId?: number;
  isBookmark?: boolean;
}

export default function FlipCard({
  jobTitle,
  jobDescription,
  recommendationScore,
  jobImage,
  strengths,
  memberOccupationId,
  isBookmark = false,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isScrap, setIsScrap] = useState(isBookmark);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleToggleScrap = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!memberOccupationId) {
      console.error('memberOccupationId가 필요합니다.');
      return;
    }

    try {
      const response = await fetch('/api/chat/jobs/save/job-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          occupationId: memberOccupationId,
        }),
      });

      const data = await response.json();

      if (data.result === 'SUCCESS') {
        setIsScrap(!isScrap);
      } else {
        console.error('북마크 저장 실패:', data.error);
      }
    } catch (error) {
      console.error('북마크 API 호출 실패:', error);
    }
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
                <h3 className="top-5 text-white self-stretch text-[32px] font-semibold leading-[140%] tracking-[-0.8px]">
                  {jobTitle}
                </h3>
                <button
                  onClick={handleToggleScrap}
                  className={`text-[45px] transition-all duration-300 hover:scale-110 ml-2 ${
                    isScrap ? 'text-yellow-400' : 'text-gray-400'
                  }`}
                >
                  {isScrap ? <HiStar /> : <PiStarThin />}
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
          <div className="w-full h-full p-6 flex flex-col relative">
            {/* 상단: 제목 */}
            <div className="flex justify-center items-center">
              <h4 className="text-2xl font-semibold text-gray-800 mt-2">
                AI 직업 추천도
              </h4>
            </div>

            {/* 추천 점수 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-center">
                <div className="text-[100px] font-bold">
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
            </div>

            {/* 하단: 설명 텍스트 */}
            <div className="absolute top-5/6 left-6 right-6 text-center">
              {strengths && (
                <p className="text-lg font-normal leading-[150%] tracking-[-0.025em] text-black text-center break-words px-2">
                  {strengths.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
