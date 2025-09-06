'use client';

import { useState } from 'react';
import { HiStar } from 'react-icons/hi';
import { PiStarThin } from 'react-icons/pi';

interface FlipCardProps {
  jobTitle: string;
  jobDescription: string;
  recommendationScore: number;
  strengths: {
    title: string;
    percentage: number;
    description: string;
  };
  workingConditions: {
    title: string;
    percentage: number;
    description: string;
  };
  preferences: {
    title: string;
    percentage: number;
    description: string;
  };
  userName: string;
  onJobPostingClick: () => void;
}

export default function FlipCard({
  jobTitle,
  jobDescription,
  recommendationScore,
  strengths,
  workingConditions,
  preferences,
  userName,
  onJobPostingClick,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isScrap, setIsScrap] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleToggleScrap = () => {
    setIsScrap(!isScrap);
  };

  return (
    <div
      className="relative "
      style={{ width: '384px', height: '595px', flexShrink: 0 }}
      onClick={handleCardClick}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 앞면 - 직업 추천 카드 */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden border-2 border-yellow-200 rounded-lg p-4 bg-white flex flex-col"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-[344px] h-[286px] bg-gray-200 rounded-lg relative">
            <div className="absolute top-2 right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          </div>

          <div className="">
            <div>
              <div className="flex items-center justify-between mb-2 mt-[40px]">
                <span className="text-title-large">{jobTitle}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleScrap();
                  }}
                  className={`text-5xl transition-all duration-300 hover:scale-110 ${
                    isScrap ? 'text-gray-300' : 'text-yellow-400'
                  }`}
                >
                  {isScrap ? <PiStarThin /> : <HiStar />}
                </button>
              </div>
              <p className="text-gray-600 text-body-large-medium">
                {jobDescription}
              </p>
            </div>

            <div className="flex items-end justify-between mt-[40px]">
              <div>
                <p className="text-body-medium-medium text-gray-600">
                  직업 추천도
                </p>
                <p className="text-title-xlarge text-gray-800">
                  {recommendationScore}%
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onJobPostingClick();
                }}
                className="px-4 py-2 rounded-lg text-title-medium text-primary-90 transition-colors"
              >
                채용공고 확인하기
              </button>
            </div>
          </div>
        </div>

        {/* 뒷면 - 직업 적합성 카드 */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden border-2 border-yellow-200 rounded-lg p-4 bg-white rotate-y-180"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-title-large">{userName}님과의 직업 적합성</h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleScrap();
              }}
              className={`text-5xl transition-all duration-300 hover:scale-110 ${
                isScrap ? 'text-gray-300' : 'text-yellow-400'
              }`}
            >
              {isScrap ? <PiStarThin /> : <HiStar />}
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {/* 강점 섹션 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-title-medium">강점</span>
                <span className="text-body-small-medium text-gray-70">
                  {strengths.title} {strengths.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-5">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${strengths.percentage}%` }}
                ></div>
              </div>
              <p className="text-body-small-regular">{strengths.description}</p>
            </div>

            {/* 근무조건 섹션 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-title-medium">근무조건</span>
                <span className="text-body-small-medium text-gray-70">
                  {workingConditions.title} {workingConditions.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-5">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${workingConditions.percentage}%` }}
                ></div>
              </div>
              <p className="text-body-small-regular">
                {workingConditions.description}
              </p>
            </div>

            {/* 희망사항 섹션 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-title-medium">희망사항</span>
                <span className="text-body-small-medium text-gray-70">
                  {preferences.title} {preferences.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-5">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${preferences.percentage}%` }}
                ></div>
              </div>
              <p className="text-body-small-regular">
                {preferences.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
