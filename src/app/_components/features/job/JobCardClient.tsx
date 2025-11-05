'use client';

import { JobSummary } from '@/types/job';
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { HiStar } from 'react-icons/hi';
import { PiStarThin } from 'react-icons/pi';
import { getUserData } from '@/lib/auth';
import { getJobDetailById } from '@/lib/api/jobApi';

const formatSalary = (salary: string | null | undefined): string => {
  if (!salary) return '급여 미정';
  return salary.replace(/(\d+)원/g, (match, number) => {
    return parseInt(number).toLocaleString('ko-KR') + '원';
  });
};

const formatWorkPeriod = (workPeriod: string | null | undefined): string => {
  if (!workPeriod) return '근무시간 미정';
  return workPeriod.replace(/^\(근무시간\)\s*/g, '');
};

const calculateDaysLeft = (closingDate: string | null | undefined): string => {
  if (!closingDate) return 'D-?';
  try {
    let dateString = closingDate;
    const dateInParentheses = closingDate.match(/\((\d{4}-\d{2}-\d{2})\)/);
    if (dateInParentheses) {
      dateString = dateInParentheses[1];
    }
    const dateFormats = [
      /^\d{4}-\d{2}-\d{2}$/,
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
      /^\d{4}\/\d{2}\/\d{2}$/,
      /^\d{2}\/\d{2}\/\d{4}$/,
      /^\d{4}\.\d{2}\.\d{2}$/,
    ];
    const isValidDate = dateFormats.some((format) => format.test(dateString));
    if (!isValidDate) {
      return 'D-?';
    }
    const targetDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    const timeDiff = targetDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) {
      return '마감';
    } else if (daysLeft === 0) {
      return 'D-Day';
    } else if (daysLeft === 1) {
      return '내일 마감';
    } else {
      return `D-${daysLeft}`;
    }
  } catch {
    return 'D-?';
  }
};

const styles = {
  card: (isExpanded: boolean, isAnimating: boolean) =>
    `relative rounded-2xl md:rounded-3xl border-2 md:border-4 border-[#E1F5EC] overflow-hidden cursor-pointer shadow-[0_4px_12px_0_rgba(17,17,17,0.1)] md:shadow-[0_10px_20px_0_rgba(17,17,17,0.15)] p-3 md:p-5 w-full max-w-[588px] mx-auto transition-all duration-700 ease-in-out ${
      isExpanded
        ? 'max-h-[2000px] opacity-100 bg-white'
        : 'max-h-[320px] md:max-h-[460px] opacity-100 hover:bg-[#E1F5EC]'
    } ${isAnimating ? 'pointer-events-none' : ''}`,
  tag: (_isHovered: boolean, isExpanded: boolean, isVisible: boolean = true) =>
    `flex px-2 py-1 rounded-full text-sm md:text-base text-gray-50 bg-primary-20 transition-all duration-500 ease-out ${isExpanded ? 'opacity-100 translate-y-0 scale-100' : isVisible ? 'opacity-0 translate-y-2 scale-95' : 'opacity-0 translate-y-2 scale-95'}`,
  compactTag: (_isHovered: boolean, _isExpanded: boolean) =>
    `flex px-2 py-1 rounded-full text-sm md:text-base text-gray-50 bg-primary-20 transition-all duration-400 ease-in-out`,
  recommendationScore: (isLoggedIn: boolean) => ({
    color: 'var(--color-style-900-black, #111)',
    textAlign: 'right' as const,
    fontFamily: '"Pretendard Variable"',
    fontSize: 'clamp(20px, 5vw, 36px)',
    fontStyle: 'normal' as const,
    fontWeight: 600,
    lineHeight: '140%',
    letterSpacing: '-0.9px',
    filter: !isLoggedIn ? 'blur(8px)' : 'none',
    transition: 'filter 0.3s ease-in-out',
  }),
  expandedRecommendationScore: (isLoggedIn: boolean) => ({
    color: 'var(--color-style-900-black, #111)',
    textAlign: 'right' as const,
    fontFamily: '"Pretendard Variable"',
    fontSize: 'clamp(24px, 6vw, 36px)',
    fontStyle: 'normal' as const,
    fontWeight: 600,
    lineHeight: '140%',
    letterSpacing: '-0.9px',
    filter: !isLoggedIn ? 'blur(8px)' : 'none',
    transition: 'filter 0.3s ease-in-out',
  }),
};

const Tag = ({
  children,
  isHovered,
  isExpanded,
  isVisible = true,
  isCompact = false,
  delay = 0,
}: {
  children: string;
  isHovered: boolean;
  isExpanded: boolean;
  isVisible?: boolean;
  isCompact?: boolean;
  delay?: number;
}) => (
  <span
    className={
      isCompact
        ? styles.compactTag(isHovered, isExpanded)
        : styles.tag(isHovered, isExpanded, isVisible)
    }
    style={{ transitionDelay: `${delay}ms` }}
  >
    {children}
  </span>
);

const RecommendationScore = ({
  job,
  isLoggedIn,
  isExpanded = false,
}: {
  job: JobSummary;
  isLoggedIn: boolean;
  isExpanded?: boolean;
}) => {
  const shouldShowRecommendation = isLoggedIn && job.jobRecommendScore !== null;
  if (!shouldShowRecommendation) {
    return null;
  }
  return (
    <div
      className={`flex flex-col md:flex-row items-center gap-2 md:gap-4 transition-all duration-500 ease-in-out ${isExpanded ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-100 translate-x-0 translate-y-0 scale-100'}`}
      style={isExpanded ? { transitionDelay: '500ms' } : {}}
    >
      <span className="text-xs md:text-lg text-gray-500">직업 추천도</span>
      <span
        className={`font-bold text-black ${isExpanded ? 'text-2xl md:text-title-xlarge' : 'text-xl md:text-title-xlarge'}`}
        style={
          isExpanded
            ? styles.expandedRecommendationScore(isLoggedIn)
            : styles.recommendationScore(isLoggedIn)
        }
      >
        {job.jobRecommendScore}%
      </span>
    </div>
  );
};

const DetailItem = ({
  label,
  value,
  isPrimary = false,
}: {
  label: string;
  value: string | ReactNode;
  isPrimary?: boolean;
}) => (
  <div className="grid grid-cols-[4rem_1fr] md:grid-cols-[5rem_1fr] gap-2 text-sm">
    <span className="text-gray-500 text-sm md:text-xl">{label}</span>
    <span
      className={`text-sm md:text-xl ${isPrimary ? 'text-primary-90' : 'text-black'}`}
    >
      {value}
    </span>
  </div>
);

interface JobCardClientProps {
  job: JobSummary;
  onToggleScrap: (jobId: string) => void;
  isOpen?: boolean;
  onToggle?: (jobId: string) => void;
}

export default function JobCardClient({
  job,
  onToggleScrap,
  isOpen = false,
  onToggle,
}: JobCardClientProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isScrap, setIsScrap] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // isOpen prop이 제공되면 외부에서 제어, 아니면 내부 상태 사용
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);
  const isExpanded = onToggle !== undefined ? isOpen : internalIsExpanded;

  useEffect(() => {
    const userData = getUserData();
    setIsLoggedIn(!!userData);
    setIsScrap(job.isScrap || false);
  }, [job.isScrap]);

  // 외부에서 isOpen이 변경될 때 애니메이션 처리
  useEffect(() => {
    if (onToggle !== undefined) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onToggle]);

  const handleToggleScrap = async (jobId: string) => {
    try {
      if (isScrap) {
        const response = await fetch(
          `/api/heart-lists/job/delete?jobId=${jobId}`,
          { method: 'DELETE' }
        );
        if (response.ok) {
          setIsScrap(false);
        }
      } else {
        const response = await fetch('/api/heart-lists/job/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId }),
        });
        if (response.ok) {
          setIsScrap(true);
        }
      }
      onToggleScrap(jobId);
    } catch (error) {
      console.error('북마크 처리 중 오류:', error);
    }
  };

  const handleCardClick = () => {
    // onClick에서 이미 isExpanded 체크를 하고 있으므로, 여기서는 항상 열려있지 않은 상태
    setIsAnimating(true);

    if (onToggle) {
      // 외부에서 제어하는 경우
      onToggle(job.jobId);
      setTimeout(() => setIsAnimating(false), 700);
    } else {
      // 내부 상태로 제어하는 경우
      setTimeout(() => setInternalIsExpanded(true), 100);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  const handleClose = () => {
    if (!isExpanded) return;
    setIsAnimating(true);

    if (onToggle) {
      // 외부에서 제어하는 경우 - 같은 카드를 클릭하면 닫기
      onToggle(job.jobId);
      setTimeout(() => setIsAnimating(false), 700);
    } else {
      // 내부 상태로 제어하는 경우
      setTimeout(() => setInternalIsExpanded(false), 100);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  const handleApplyClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (job.requiredDocuments) {
        window.open(job.requiredDocuments, '_blank', 'noopener,noreferrer');
        return;
      }
      const jobDetail = await getJobDetailById(Number(job.jobId));
      if (jobDetail.requiredDocuments) {
        window.open(
          jobDetail.requiredDocuments,
          '_blank',
          'noopener,noreferrer'
        );
      } else {
        window.open(job.applyLink, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error fetching job detail:', error);
      window.open(job.applyLink, '_blank', 'noopener,noreferrer');
    }
  };

  const renderTags = (isCompact = false) => {
    const categories =
      job.jobCategory && job.jobCategory.trim() !== ''
        ? job.jobCategory
            .split(/,(?![^(]*\))/)
            .filter(
              (category) => category.trim() !== '' && category.trim() !== '.'
            )
        : [];
    const skills =
      job.requiredSkills
        ?.split(/,(?![^(]*\))/)
        .filter((skill) => skill.trim() !== '' && skill.trim() !== '.') || [];
    return (
      <div className="flex flex-wrap gap-1 md:gap-2 md:text-3xl">
        {categories.map((category, i) => (
          <Tag
            key={`category-${i}`}
            isHovered={isHovered}
            isExpanded={isExpanded}
            isCompact={isCompact}
            delay={i * (isCompact ? 50 : 100)}
          >
            {category.trim()}
          </Tag>
        ))}
        {skills.map((skill, i) => (
          <Tag
            key={`skill-${i}`}
            isHovered={isHovered}
            isExpanded={isExpanded}
            isVisible={!isCompact}
            isCompact={isCompact}
            delay={(i + categories.length) * (isCompact ? 50 : 100)}
          >
            {skill.trim()}
          </Tag>
        ))}
      </div>
    );
  };

  const renderDetails = () => (
    <div className="space-y-2 md:space-y-3 md:text-xl transition-all duration-500 ease-out">
      <DetailItem
        label="마감일"
        value={
          <>
            {job.closingDate || '마감일 미정'}{' '}
            <span style={{ color: '#00AD38' }}>
              ({calculateDaysLeft(job.closingDate)})
            </span>
          </>
        }
      />
      <DetailItem
        label="경력"
        value={job.experience || '경력 미정'}
        isPrimary
      />
      <DetailItem label="급여" value={formatSalary(job.salary)} isPrimary />
      <DetailItem label="고용형태" value={job.employmentType} />
      <DetailItem label="근무시간" value={formatWorkPeriod(job.workPeriod)} />
      <DetailItem
        label="연락처"
        value={job.managerPhone || '전화번호 미공개'}
      />
    </div>
  );

  return (
    <div
      className={styles.card(isExpanded, isAnimating)}
      onClick={isExpanded ? handleClose : handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 상단 이미지 */}
      <div
        className="relative flex-shrink-0 rounded-lg md:rounded-xl transition-all duration-700 ease-in-out w-full h-[120px] md:h-[200px]"
        style={{
          background: `url(${job.companyLogo || '/default-profile.png'}) lightgray 50% / cover no-repeat`,
        }}
      >
        {/* Compact 오버레이 */}
        <div
          className={`absolute bottom-0 left-0 right-0 py-2 md:py-4 px-3 md:px-6 transition-all duration-500 ease-in-out transform ${
            isExpanded ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
          }`}
          style={{
            borderRadius: '8px',
            background: 'rgba(17, 17, 17, 0.50)',
            boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.25)',
          }}
        >
          <div className="flex justify-between items-center text-white">
            <div className="flex flex-row gap-1 md:gap-3 flex-1 min-w-0">
              <div className="text-lg md:text-2xl flex items-center truncate font-medium">
                {(job.companyName || '회사명 미정').length > 10
                  ? `${(job.companyName || '회사명 미정').substring(0, 10)}···`
                  : job.companyName || '회사명 미정'}
              </div>
              <div className="text-xs md:text-base text-gray-300 flex items-center truncate">
                {(job.workLocation || '근무지 미정').length > 10
                  ? `${(job.workLocation || '근무지 미정').substring(0, 10)}···`
                  : job.workLocation || '근무지 미정'}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm md:text-xl font-medium">
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
            <div className="flex justify-between items-start my-4 md:my-6">
              <div className="flex flex-col gap-2 md:gap-3 flex-1 min-w-0">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-3 transition-all duration-500 ease-out">
                  <span className="text-xl md:text-2xl text-gray-800 truncate font-semibold">
                    {job.companyName || '회사명 미정'}
                  </span>
                  <span className="text-base md:text-body-small-medium text-gray-500 truncate">
                    {job.workLocation || '근무지 미정'}
                  </span>
                </div>
                {renderTags()}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleScrap(job.jobId);
                  }}
                  className={`text-3xl md:text-5xl transition-all duration-300 hover:scale-110 ${
                    isScrap ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  {isScrap ? <HiStar /> : <PiStarThin />}
                </button>
              </div>
            </div>

            {/* 직무 설명 */}
            <p className="text-gray-800 text-xl md:text-3xl leading-relaxed mb-6 md:mb-12 transition-all duration-500 ease-out font-semibold">
              {job.jobTitle || '직무명 미정'}
            </p>

            {/* 상세 정보 */}
            {renderDetails()}

            {/* 추천도 */}
            <div className="flex justify-end">
              <RecommendationScore
                job={job}
                isLoggedIn={isLoggedIn}
                isExpanded
              />
            </div>

            {/* 버튼 */}
            <div className="mt-4 md:mt-6 md:text-2xl transition-all duration-500 ease-out">
              <button
                className="flex items-center justify-center w-full h-[60px] md:h-[78px] bg-primary-90 text-white py-3 rounded-2xl md:rounded-3xl text-base md:text-2xl hover:bg-green-600 transition-all duration-300 block text-center"
                onClick={handleApplyClick}
              >
                자세히 보기
              </button>
            </div>
          </div>
        ) : (
          // Compact 상태
          <div className="space-y-2 md:space-y-3 transition-all duration-500 ease-in-out">
            <p className="text-gray-800 text-xl md:text-3xl leading-relaxed pt-2 md:pt-3 transition-all duration-400 ease-in-out font-semibold">
              {(job.jobTitle || '직무명 미정').length > 52
                ? `${(job.jobTitle || '직무명 미정').substring(0, 52)}···`
                : job.jobTitle || '직무명 미정'}
            </p>

            {renderTags(true)}

            <div className="flex justify-between items-center transition-all duration-400 ease-in-out">
              <div className="flex items-center gap-2 pt-1 md:pt-[10px]">
                <span className="text-base md:text-body-medium-medium text-gray-500 font-medium">
                  급여
                </span>
                <span className="text-base md:text-body-medium-medium text-primary-90 font-semibold">
                  {formatSalary(job.salary)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compact 추천도 */}
      <div
        className={`absolute bottom-3 right-3 md:bottom-5 md:right-5 transition-all duration-500 ease-in-out ${
          isExpanded
            ? 'opacity-0 translate-x-4 translate-y-4 scale-95'
            : 'opacity-100 translate-x-0 translate-y-0 scale-100'
        }`}
      >
        <RecommendationScore job={job} isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}
