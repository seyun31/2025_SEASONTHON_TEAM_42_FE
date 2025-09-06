'use client';

import Image from 'next/image';

interface JobRecommendation {
  imageUrl: string;
  occupationName: string;
  description: string;
  score: string;
}

interface AIChatJobRecommendCardProps {
  first?: JobRecommendation;
  second?: JobRecommendation;
  third?: JobRecommendation;
}

export default function AIChatJobRecommendCard({
  first,
  second,
  third,
}: AIChatJobRecommendCardProps) {
  const jobs = [first, second, third].filter(Boolean);

  if (jobs.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-chat-message">추천 결과를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto">
      {jobs.map((job, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-4 border border-gray-200 min-w-[300px] flex-shrink-0"
        >
          <div className="flex items-center space-x-3">
            {job?.imageUrl && (
              <img
                src={job.imageUrl}
                alt={job.occupationName}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-bold text-lg text-primary-90">
                {index + 1}순위: {job?.occupationName}
              </h3>
              <p className="text-sm text-gray-600 mt-1">적합도: {job?.score}</p>
              <p className="text-sm text-gray-700 mt-2">{job?.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
