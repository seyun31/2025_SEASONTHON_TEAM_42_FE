'use client';

import { JobSummary } from '@/types/job';
import { useState } from 'react';
import { HiStar } from 'react-icons/hi';
import { PiStarThin } from 'react-icons/pi';

interface JobCardProps {
  job: JobSummary;
  onToggleScrap: (jobId: string) => void;
}

export default function JobCard({ job, onToggleScrap }: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isScrap, setIsScrap] = useState(job.isScrap);

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
    >
      {/* 상단 이미지 */}
      <div
        className="relative flex-shrink-0 rounded-xl transition-all duration-700 ease-in-out"
        style={{
          width: '540px',
          height: '200px',
          background: `url(${job.companyLogo}) lightgray 50% / cover no-repeat`,
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
                {job.companyName}
              </div>
              <div className="text-body-small-medium text-gray-300 flex items-center">
                {job.workLocation}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-body-large-medium">{job.closingDate}</span>
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
            <div className="flex justify-between items-center my-4">
              <div className="flex flex-col gap-3">
                <div className="flex flex-row items-center gap-3 transition-all duration-500 ease-out">
                  <span className="text-title-medium text-gray-800">
                    {job.companyName}
                  </span>
                  <span className="text-body-small-medium text-gray-500">
                    {job.workLocation}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.split(',').map((skill, i) => (
                    <span
                      key={i}
                      className={`flex px-2 py-1 rounded-full text-body-small-medium text-gray-50 bg-primary-20 transition-all duration-500 ease-out ${
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
            <p className="text-gray-800 text-title-large leading-relaxed mb-4 transition-all duration-500 ease-out">
              {job.jobTitle}
            </p>

            {/* 상세 정보 */}
            <div className="space-y-3 transition-all duration-500 ease-out">
              <div className="grid grid-cols-[5rem_1fr] gap-2 text-sm">
                <span className="text-gray-500">마감일</span>
                <span className="text-gray-800">{job.closingDate}</span>
              </div>
              <div className="grid grid-cols-[5rem_1fr] gap-2 text-sm">
                <span className="text-gray-500">경력</span>
                <span className="text-gray-800 text-primary-90">
                  {job.experience}
                </span>
              </div>
              <div className="grid grid-cols-[5rem_1fr] gap-2 text-sm">
                <span className="text-gray-500">급여</span>
                <span className="text-gray-800 text-primary-90">
                  {job.salary}
                </span>
              </div>
              <div className="grid grid-cols-[5rem_1fr] gap-2 text-sm">
                <span className="text-gray-500">근무기간</span>
                <span className="text-gray-800">{job.workPeriod}</span>
              </div>
              <div className="grid grid-cols-[5rem_1fr] gap-2 text-sm">
                <span className="text-gray-500">고용형태</span>
                <span className="text-gray-800">{job.employmentType}</span>
              </div>
            </div>

            {/* 추천도 */}
            <div
              className={`absolute bottom-20 right-5 flex gap-4 transition-all duration-500 ease-out items-center ${
                isExpanded
                  ? 'opacity-100 translate-x-0 translate-y-0'
                  : 'opacity-0 translate-x-4 translate-y-4'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              <span className="text-body-large-medium text-gray-500">
                직업 추천도
              </span>
              <span className="text-title-xlarge font-bold text-black">
                {job.jobRecommendScore > 0
                  ? `${job.jobRecommendScore}%`
                  : '100%'}
              </span>
            </div>

            {/* 버튼 */}
            <div className="mt-6 transition-all duration-500 ease-out">
              <a
                href={job.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary-90 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-all duration-300 hover:scale-105 block text-center"
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
              {job.jobTitle}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {job.requiredSkills.split(',').map((tag, i) => (
                <span
                  key={i}
                  className={`flex px-2 py-1 rounded-full text-body-small-medium text-gray-50 bg-primary-20 transition-all duration-400 ease-in-out ${
                    isExpanded
                      ? 'opacity-0 translate-y-2 scale-95'
                      : 'opacity-100 translate-y-0 scale-100'
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
                  {job.salary}
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
        <span className="text-title-xlarge font-bold text-black">
          {job.jobRecommendScore > 0 ? `${job.jobRecommendScore}%` : '??%'}
        </span>
      </div>
    </div>
  );
}
