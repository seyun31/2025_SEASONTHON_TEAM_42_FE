'use client';

import { jobRecommendations } from '@/mock/jobData';
import { useState, useEffect } from 'react';
import JobCard from '@/components/card-component/JobCard';
import { getUserData } from '@/lib/auth';

export default function EducationRecommendationsSection() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const userData = getUserData();
    if (userData?.name) {
      setUserName(userData.name);
    }
  }, []);

  const toggleScrap = (jobId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(jobId)) {
      newFavorites.delete(jobId);
    } else {
      newFavorites.add(jobId);
    }
    setFavorites(newFavorites);
  };

  return (
    <section className="w-full px-4 py-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-title-xlarge text-gray-80">
            {userName
              ? `${userName}님을 위한 오늘의 맞춤 교육 추천`
              : '오늘의 교육 추천'}
          </h2>
          <a
            href="/education-programs"
            className="text-primary-300 hover:text-primary-600 transition-colors"
          >
            더보기
          </a>
        </div>

        {/* <div className="flex flex-row gap-6">
          <div className="flex flex-col gap-6 flex-1">
            {jobRecommendations.slice(0, 4).map((job) => (
              <JobCard key={job.jobId} job={job} onToggleScrap={toggleScrap} />
            ))}
          </div>
          <div className="flex flex-col gap-6 flex-1">
            {jobRecommendations.slice(4, 8).map((job) => (
              <JobCard key={job.jobId} job={job} onToggleScrap={toggleScrap} />
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}
