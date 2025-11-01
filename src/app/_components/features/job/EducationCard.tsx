'use client';

import { EducationSummary } from '@/types/job';
import { useState, useEffect } from 'react';
import { HiStar } from 'react-icons/hi';
import { PiStarThin } from 'react-icons/pi';

// 날짜 포맷팅 함수
const formatDate = (dateString: string): string => {
  if (!dateString) return '날짜 미정';

  try {
    // YYYYMMDD 형식을 YYYY-MM-DD로 변환
    if (dateString.length === 8) {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      return `${year}-${month}-${day}`;
    }
    return dateString;
  } catch {
    return '날짜 미정';
  }
};

// 기간 계산 함수
const calculateDuration = (startDate: string, endDate: string): string => {
  if (!startDate || !endDate) return '기간 미정';

  try {
    const start = new Date(formatDate(startDate));
    const end = new Date(formatDate(endDate));

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return '기간 미정';
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return `D - ${diffDays}`;
  } catch {
    return '기간 미정';
  }
};

// 공통 스타일 클래스
const styles = {
  card: (isExpanded: boolean, isAnimating: boolean) =>
    `relative rounded-2xl md:rounded-3xl border-2 md:border-4 border-[#BEC7D6] overflow-hidden cursor-pointer shadow-[0px_10px_10px_0px_#5786DA33] p-3 md:p-5 w-full max-w-[588px] mx-auto transition-all duration-700 ease-in-out ${
      isExpanded
        ? 'max-h-[2000px] opacity-100 bg-white'
        : 'max-h-[320px] md:max-h-[460px] opacity-100 hover:bg-secondary4'
    } ${isAnimating ? 'pointer-events-none' : ''}`,

  tag: (isHovered: boolean, isExpanded: boolean, isVisible: boolean = true) =>
    `flex px-2 py-1 rounded-full text-sm md:text-base transition-all duration-500 ease-out ${
      isExpanded
        ? 'opacity-100 translate-y-0 scale-100'
        : isVisible
          ? 'opacity-0 translate-y-2 scale-95'
          : 'opacity-0 translate-y-2 scale-95'
    }`,

  compactTag: () =>
    `flex px-2 py-1 rounded-full text-sm md:text-base transition-all duration-400 ease-in-out`,

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

// 태그 컴포넌트
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
        ? styles.compactTag()
        : styles.tag(isHovered, isExpanded, isVisible)
    }
    style={{
      transitionDelay: `${delay}ms`,
      backgroundColor: '#9FC2FF33',
      color: '#7A808A',
    }}
  >
    {children}
  </span>
);

// 추천도 표시 컴포넌트
const RecommendationScore = () => {
  // 교육과정에는 추천도가 없으므로 아예 렌더링하지 않음
  return null;
};

// 상세 정보 그리드 아이템 컴포넌트
const DetailItem = ({
  label,
  value,
  isPrimary = false,
}: {
  label: string;
  value: string;
  isPrimary?: boolean;
}) => (
  <div className="grid grid-cols-[4rem_1fr] md:grid-cols-[5rem_1fr] gap-2 text-sm">
    <span className="text-gray-500 text-sm md:text-xl">{label}</span>
    <span
      className={`text-sm md:text-xl ${isPrimary ? 'text-secondary4' : 'text-black'}`}
    >
      {value}
    </span>
  </div>
);

interface EducationCardProps {
  education: EducationSummary;
  onToggleBookmark: (educationId: string) => void;
  isBookmarked?: boolean;
}

export default function EducationCard({
  education,
  onToggleBookmark,
  isBookmarked = false,
}: EducationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBookmark, setIsBookmark] = useState(isBookmarked);
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  useEffect(() => {
    // education.isBookmark 정보를 우선적으로 사용하고, 없으면 isBookmarked prop 사용
    setIsBookmark(education.isBookmark ?? isBookmarked);
  }, [education.isBookmark, isBookmarked]);

  const handleToggleBookmark = async (educationId: string) => {
    if (isBookmarkLoading) return; // 이미 요청 중이면 중복 요청 방지

    setIsBookmarkLoading(true);
    try {
      if (isBookmark) {
        // 북마크 삭제
        const response = await fetch(
          `/api/heart-lists/edu/delete?educationId=${educationId}`,
          {
            method: 'DELETE',
          }
        );
        if (response.ok) {
          setIsBookmark(false);
          onToggleBookmark(educationId);
        }
      } else {
        // 북마크 저장
        const response = await fetch('/api/heart-lists/edu/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ educationId }),
        });
        if (response.ok) {
          setIsBookmark(true);
          onToggleBookmark(educationId);
        }
      }
    } catch (error) {
      console.error('북마크 처리 중 오류:', error);
    } finally {
      setIsBookmarkLoading(false);
    }
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

  // 태그 렌더링 함수
  const renderTags = (isCompact = false) => {
    const tags = [];

    // keyword1과 keyword2를 태그로 표시
    if (education.contents && education.contents.trim() !== '') {
      tags.push(education.contents.trim());
    }

    // 기존 trainTarget도 유지
    if (education.trainTarget && education.trainTarget.trim() !== '') {
      const categories = education.trainTarget.split(',');
      tags.push(...categories.map((cat) => cat.trim()));
    }

    return (
      <div className="flex flex-wrap gap-1 md:gap-2 md:text-3xl">
        {tags.map((tag, i) => (
          <Tag
            key={`tag-${i}`}
            isHovered={isHovered}
            isExpanded={isExpanded}
            isCompact={isCompact}
            delay={i * (isCompact ? 50 : 100)}
          >
            {tag}
          </Tag>
        ))}
      </div>
    );
  };

  // 상세 정보 렌더링 함수
  const renderDetails = () => (
    <div className="space-y-2 md:space-y-3 md:text-xl transition-all duration-500 ease-out">
      <DetailItem
        label="기간"
        value={calculateDuration(education.traStartDate, education.traEndDate)}
        isPrimary
      />
      <DetailItem label="시작일" value={formatDate(education.traStartDate)} />
      <DetailItem label="종료일" value={formatDate(education.traEndDate)} />
      <DetailItem
        label="교육시간"
        value={education.trprDegr ? `${education.trprDegr}시간` : '미정'}
        isPrimary
      />
      <DetailItem
        label="수강료"
        value={
          education.courseMan
            ? `${Number(education.courseMan).toLocaleString()}원`
            : '문의'
        }
      />
      <DetailItem label="기관" value={education.institution || '기관 미정'} />
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
          background: `url(${education.imageUrl || '/default-profile.png'}) lightgray 50% / cover no-repeat`,
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
              <div className="text-lg md:text-2xl flex items-center font-medium">
                {(education.title || '교육과정명 미정').length > 10
                  ? `${(education.title || '교육과정명 미정').substring(0, 10)}···`
                  : education.title || '교육과정명 미정'}
              </div>
              <div className="text-xs md:text-base text-gray-300 flex items-center">
                {(education.address || '위치 미정').length > 10
                  ? `${(education.address || '위치 미정').substring(0, 10)}···`
                  : education.address || '위치 미정'}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm md:text-xl font-medium">
                {calculateDuration(
                  education.traStartDate,
                  education.traEndDate
                )}
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
            {/* 교육과정명, 위치, 태그 */}
            <div className="flex justify-between items-start my-4 md:my-6">
              <div className="flex flex-col gap-2 md:gap-3 flex-1 min-w-0">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-3 transition-all duration-500 ease-out">
                  <span
                    className="text-gray-800 truncate font-semibold"
                    style={{ fontSize: '28px' }}
                  >
                    {education.subTitle || '교육과정명 미정'}
                  </span>
                  <span className="text-base md:text-body-small-medium text-gray-500 truncate">
                    {education.address || '위치 미정'}
                  </span>
                </div>
                {renderTags()}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleBookmark(
                      education.educationId?.toString() || education.trprId
                    );
                  }}
                  className={`text-3xl md:text-5xl transition-all duration-300 hover:scale-110 ${
                    isBookmark ? 'text-blue-500' : 'text-gray-300'
                  } ${isBookmarkLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  disabled={isBookmarkLoading}
                >
                  {isBookmark ? <HiStar /> : <PiStarThin />}
                </button>
              </div>
            </div>

            {/* 교육과정 설명 */}
            <p
              className="text-gray-800 leading-relaxed mb-6 md:mb-12 transition-all duration-500 ease-out font-medium"
              style={{ fontSize: '28px' }}
            >
              {education.title || education.contents || '교육과정 설명 미정'}
            </p>

            {/* 상세 정보 */}
            {renderDetails()}

            {/* 버튼 */}
            <div className="mt-4 md:mt-6 md:text-2xl transition-all duration-500 ease-out">
              <a
                href={education.titleLink || education.subTitleLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full h-[60px] md:h-[78px] bg-secondary4 text-white py-3 rounded-2xl md:rounded-3xl text-base md:text-2xl hover:bg-secondary4 transition-all duration-300 block text-center"
                onClick={(e) => e.stopPropagation()}
              >
                자세히 보기
              </a>
            </div>
          </div>
        ) : (
          // Compact 상태
          <div className="space-y-2 md:space-y-3 transition-all duration-500 ease-in-out">
            <p
              className="text-gray-800 text-bold leading-relaxed pt-2 md:pt-3 transition-all duration-400 ease-in-out font-medium"
              style={{ fontSize: '28px' }}
            >
              {education.title || '교육과정명 미정'}
            </p>

            {renderTags(true)}

            <div className="flex justify-between items-center transition-all duration-400 ease-in-out">
              <div className="flex items-center gap-2 pt-1 md:pt-[10px]">
                <span className="text-base md:text-body-medium-medium text-gray-500 font-medium">
                  기간
                </span>
                <span className="text-base md:text-body-medium-medium text-secondary4 font-semibold">
                  {calculateDuration(
                    education.traStartDate,
                    education.traEndDate
                  )}
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
        <RecommendationScore />
      </div>
    </div>
  );
}
