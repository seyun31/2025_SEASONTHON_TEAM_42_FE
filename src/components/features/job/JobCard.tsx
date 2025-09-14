'use client';

import { JobSummary } from '@/types/job';
import { useState, useEffect } from 'react';
import { HiStar } from 'react-icons/hi';
import { PiStarThin } from 'react-icons/pi';
import { getUserData } from '@/lib/auth';

// 디데이 계산 함수
const calculateDaysLeft = (closingDate: string | null | undefined): string => {
  if (!closingDate) return '마감일 미정';

  try {
    // 다양한 날짜 형식 지원
    const dateFormats = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, // YYYY-MM-DD HH:MM:SS
      /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
      /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
      /^\d{4}\.\d{2}\.\d{2}$/, // YYYY.MM.DD
    ];

    // 날짜 형식이 맞는지 확인
    const isValidDate = dateFormats.some((format) => format.test(closingDate));

    if (!isValidDate) {
      return closingDate; // 날짜 형식이 아니면 원본 반환
    }

    const targetDate = new Date(closingDate);
    const today = new Date();

    // 날짜 유효성 검사
    if (isNaN(targetDate.getTime())) {
      return closingDate;
    }

    // 시간을 00:00:00으로 설정하여 정확한 일수 계산
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const timeDiff = targetDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return '마감됨';
    } else if (daysLeft === 0) {
      return '오늘 마감';
    } else if (daysLeft === 1) {
      return '내일 마감';
    } else {
      return `D-${daysLeft}`;
    }
  } catch (error) {
    return closingDate; // 에러 발생 시 원본 반환
  }
};

interface JobCardProps {
  job: JobSummary;
  onToggleScrap: (jobId: string) => void;
}

export default function JobCard({ job, onToggleScrap }: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isScrap, setIsScrap] = useState(job.isScrap);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = getUserData();
    setIsLoggedIn(!!userData);
  }, []);

  const handleToggleScrap = (jobId: string) => {
    setIsScrap(!isScrap);
    onToggleScrap(jobId);
  };

  const handleCardClick = () => {
    if (isExpanded) return;

    setIsAnimating(true);
    setTimeout(() => setIsExpanded(true), 100);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const handleClose = () => {
    if (!isExpanded) return;
    setIsAnimating(true);

    setTimeout(() => setIsExpanded(false), 100);
    setTimeout(() => setIsAnimating(false), 800);
  };

  return (
    <div
      className={`relative rounded-3xl border-4 border-[#E1F5EC] overflow-hidden cursor-pointer shadow-[0_10px_20px_0_rgba(17,17,17,0.15)] p-5 w-[588px] transition-all duration-700 ease-in-out ${
        isExpanded
          ? 'max-h-[2000px] opacity-100 bg-white'
          : 'max-h-[460px] opacity-100 hover:bg-[#E1F5EC]'
      } ${isAnimating ? 'pointer-events-none' : ''}`}
      onClick={isExpanded ? handleClose : handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 상단 이미지 */}
      <div
        className="relative flex-shrink-0 rounded-xl transition-all duration-700 ease-in-out"
        style={{
          width: '540px',
          height: '200px',
          background: `url(${job.companyLogo || '/default-profile.png'}) lightgray 50% / cover no-repeat`,
        }}
      >
        {/* Compact 오버레이 */}
        <div
          className={`absolute bottom-0 left-0 right-0 py-4 px-6 transition-all duration-500 ease-in-out transform ${
            isExpanded ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
          }`}
          style={{
            borderRadius: '12px',
            background: 'rgba(17, 17, 17, 0.50)',
            boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.25)',
          }}
        >
          <div className="flex justify-between items-center text-white">
            <div className="flex flex-row gap-3">
              <div className="text-title-medium flex items-center">
                {job.companyName || '회사명 미정'}
              </div>
              <div className="text-body-small-medium text-gray-300 flex items-center">
                {job.workLocation || '근무지 미정'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-body-large-medium">
                {calculateDaysLeft(job.closingDate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 텍스트 */}
      <div className="transition-all duration-700 ease-in-out">
        {isExpanded ? (
          <div
            className={`space-y-4 transition-all duration-600 ease-out ${
              isAnimating && !isExpanded
                ? 'opacity-0 translate-y-8'
                : 'opacity-100 translate-y-0'
            }`}
          >
            {/* 기업명, 위치, 태그 */}
            <div className="flex justify-between items-start my-6">
              <div className="flex flex-col gap-3">
                <div className="flex flex-row items-center gap-3 transition-all duration-500 ease-out">
                  <span className="text-title-medium text-gray-800">
                    {job.companyName || '회사명 미정'}
                  </span>
                  <span className="text-body-small-medium text-gray-500">
                    {job.workLocation || '근무지 미정'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(job.requiredSkills?.split(',') || []).map((skill, i) => (
                    <span
                      key={i}
                      className={`flex px-2 py-1 rounded-full text-body-small-medium text-gray-50 transition-all duration-500 ease-out ${
                        isHovered ? 'bg-[B4E6CE]' : 'bg-primary-20'
                      } ${
                        isExpanded
                          ? 'opacity-100 translate-y-0 scale-100'
                          : 'opacity-0 translate-y-2 scale-95'
                      }`}
                      style={{ transitionDelay: `${i * 100}ms` }}
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* <span className="text-body-large-medium text-gray-800">
                  {job.closingDate}
                </span> */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleScrap(job.jobId);
                  }}
                  className={`text-5xl transition-all duration-300 hover:scale-110 ${
                    isScrap ? 'text-gray-300' : 'text-yellow-400'
                  }`}
                >
                  {isScrap ? <PiStarThin /> : <HiStar />}
                </button>
              </div>
            </div>

            {/* 직무 설명 */}
            <p className="text-gray-800 text-title-large leading-relaxed mb-12 transition-all duration-500 ease-out">
              {job.jobTitle || '직무명 미정'}
            </p>

            {/* 상세 정보 */}
            <div className="space-y-3 transition-all duration-500 ease-out text-body-large-medium">
              <div className="grid grid-cols-[5rem_1fr] gap-2 text-sm">
                <span className="text-gray-50 text-body-large-medium">
                  마감일
                </span>
                <span className="text-black text-body-large-medium">
                  {calculateDaysLeft(job.closingDate)}
                </span>
              </div>
              <div className="grid grid-cols-[5rem_1fr] gap-2 text-sm">
                <span className="text-gray-50 text-body-large-medium">
                  경력
                </span>
                <span className="text-primary-90 text-body-large-medium">
                  {job.experience || '경력 미정'}
                </span>
              </div>
              <div className="grid grid-cols-[5rem_1fr] gap-2 text-sm">
                <span className="text-gray-50 text-body-large-medium">
                  급여
                </span>
                <span className="text-primary-90 text-body-large-medium">
                  {job.salary || '급여 미정'}
                </span>
              </div>
              <div className="grid grid-cols-[5rem_1fr] gap-2 text-sm">
                <span className="text-gray-50 text-body-large-medium">
                  근무기간
                </span>
                <span className="text-black text-body-large-medium">
                  {job.workPeriod}
                </span>
              </div>
              <div className="grid grid-cols-[5rem_1fr] gap-2 text-sm">
                <span className="text-gray-50 text-body-large-medium">
                  고용형태
                </span>
                <span className="text-black text-body-large-medium">
                  {job.employmentType}
                </span>
              </div>
            </div>

            {/* 추천도 */}
            <div
              className={`flex justify-end items-center gap-4
                 transition-all duration-500 ease-out ${
                   isExpanded
                     ? 'opacity-100 translate-x-0 translate-y-0'
                     : 'opacity-0 translate-x-4 translate-y-4'
                 }`}
              style={{ transitionDelay: '500ms' }}
            >
              <span className="text-body-large-medium text-gray-500">
                직업 추천도
              </span>
              <span
                className="text-title-xlarge font-bold text-black"
                style={{
                  color: 'var(--color-style-900-black, #111)',
                  textAlign: 'right',
                  fontFamily: '"Pretendard Variable"',
                  fontSize: '36px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '140%',
                  letterSpacing: '-0.9px',
                  filter: !isLoggedIn ? 'blur(8px)' : 'none',
                  transition: 'filter 0.3s ease-in-out',
                }}
              >
                {!isLoggedIn
                  ? '100%'
                  : job.jobRecommendScore !== null
                    ? `${job.jobRecommendScore}%`
                    : '??%'}
              </span>
            </div>

            {/* 버튼 */}
            <div className="mt-6 transition-all duration-500 ease-out">
              <a
                href={job.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full h-[78px] bg-primary-90 text-white py-3 rounded-3xl text-title-medium hover:bg-green-600 transition-all duration-300  block text-center"
                onClick={(e) => e.stopPropagation()}
              >
                자세히 보기
              </a>
            </div>
          </div>
        ) : (
          // Compact 상태
          <div className="space-y-3 transition-all duration-500 ease-in-out">
            <p className="text-gray-800 text-title-large leading-relaxed pt-3 transition-all duration-400 ease-in-out">
              {job.jobTitle || '직무명 미정'}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {(job.requiredSkills?.split(',') || []).map((tag, i) => (
                <span
                  key={i}
                  className={`flex px-2 py-1 rounded-full text-body-small-medium text-gray-800 transition-all duration-400 ease-in-out ${
                    isExpanded
                      ? 'bg-primary-30'
                      : isHovered
                        ? 'bg-primary-30'
                        : 'bg-primary-20'
                  }`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  {tag.trim()}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center transition-all duration-400 ease-in-out">
              <div className="flex items-center gap-2 pt-[10px]">
                <span className="text-body-medium-medium text-gray-500">
                  급여
                </span>
                <span className="text-body-medium-medium text-primary-90">
                  {job.salary || '급여 미정'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compact 추천도 */}
      <div
        className={`absolute bottom-5 right-5 flex flex-row items-center gap-4 transition-all duration-500 ease-in-out ${
          isExpanded
            ? 'opacity-0 translate-x-4 translate-y-4 scale-95'
            : 'opacity-100 translate-x-0 translate-y-0 scale-100'
        }`}
      >
        <span className="text-body-large-medium text-gray-500">
          직업 추천도
        </span>
        <span
          className="text-title-xlarge font-bold text-black"
          style={{
            color: 'var(--color-style-900-black, #111)',
            textAlign: 'right',
            fontFamily: '"Pretendard Variable"',
            fontSize: '36px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '140%',
            letterSpacing: '-0.9px',
            filter: !isLoggedIn ? 'blur(8px)' : 'none',
            transition: 'filter 0.3s ease-in-out',
          }}
        >
          {!isLoggedIn
            ? '100%'
            : job.jobRecommendScore !== null
              ? `${job.jobRecommendScore}%`
              : '??%'}
        </span>
      </div>
    </div>
  );
}
