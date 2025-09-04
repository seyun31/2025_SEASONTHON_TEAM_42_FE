'use client';

import { JobRecommendation } from '@/mock/jobData';
import { useState } from 'react';

interface JobCardProps {
  job: JobRecommendation;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function JobCard({
  job,
  isFavorited,
  onToggleFavorite,
}: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`border-4 border-[#9FC2FF] rounded-3xl p-6 cursor-pointer transition-all duration-300 w-[588px] ${
        isExpanded
          ? 'bg-white shadow-lg h-[700px]'
          : 'bg-white h-[420px] shadow-[0_10px_10px_0_rgba(0,66,11,0.15)] hover:bg-blue-50 hover:shadow-[0_10px_10px_0_rgba(0,66,11,0.25)] hover:border-[#3478F6]'
      }`}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="text-caption-large  bg-gray-200 px-3 py-1 rounded-full">
          {job.companyLogo}
        </div>
        <div className="flex items-center gap-2">
          {job.recommendationScore > 0 && (
            <span className="text-primary-600 font-medium text-caption-large">
              직업 추천도 {job.recommendationScore}%
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(job.id);
            }}
            className={`text-2xl transition-colors ${
              isFavorited ? 'text-yellow-400' : 'text-gray-20'
            }`}
          >
            ⭐
          </button>
        </div>
      </div>

      {/* Company Info */}
      <div className="mb-3">
        <p className="text-body-small-medium text-gray-80">
          {job.companyName} {job.location}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.tags.map((tag, index) => (
          <span
            key={index}
            className="text-caption-small bg-primary-20 text-primary-600 px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Job Title */}
      <h3 className="text-body-small-medium text-gray-80 mb-4 line-clamp-2">
        {job.title}
      </h3>

      {/* Basic state details - only show when not expanded */}
      {!isExpanded && (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-caption-small">
            <span className="text-gray-50">신청마감</span>
            <span className="text-gray-80">{job.applicationDeadline}</span>
          </div>
          <div className="flex justify-between text-caption-small">
            <span className="text-gray-50">수강횟수</span>
            <span className="text-gray-80">{job.sessionCount}</span>
          </div>
          <div className="flex justify-between text-caption-small">
            <span className="text-gray-50">교육기간</span>
            <span className="text-gray-80">{job.educationPeriod}</span>
          </div>
          <div className="flex justify-between text-caption-small">
            <span className="text-gray-50">금액</span>
            <span className="text-gray-80">{job.amount}</span>
          </div>
        </div>
      )}

      {/* Hover state details - show education period and amount */}
      <div className="space-y-2 mb-4">
        <div className="text-caption-small text-gray-80">
          {job.educationPeriod}
        </div>
        <div className="text-caption-small text-gray-80">{job.amount}</div>
      </div>

      {/* Expanded Content */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-4 border-t border-gray-20">
          {/* Right side details - each item on its own line */}
          <div className="space-y-3">
            {job.recommendationScore > 0 && (
              <div className="text-caption-small text-primary-600 font-medium text-right">
                직업 추천도 {job.recommendationScore}%
              </div>
            )}
            <div className="text-caption-small text-gray-80 text-right">
              {job.applicationDeadline}
            </div>
            <div className="text-caption-small text-gray-80 text-right">
              {job.sessionCount}
            </div>
            <div className="text-caption-small text-gray-80 text-right">
              {job.educationPeriod}
            </div>
            <div className="text-caption-small text-gray-80 text-right">
              {job.amount}
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-6 space-y-4">
            <div className="text-caption-small text-gray-50">
              마감 {job.deadline}
            </div>

            {/* Detail Button */}
            <button className="w-full bg-primary-300 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors">
              자세히 보기
            </button>
          </div>
        </div>
      </div>

      {/* Collapsed Footer */}
      {!isExpanded && (
        <div className="flex justify-between items-center text-caption-small text-gray-50">
          <span>마감 {job.deadline}</span>
          <button className="text-primary-300 hover:text-primary-600 transition-colors">
            자세히 보기
          </button>
        </div>
      )}
    </div>
  );
}
