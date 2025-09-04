'use client';

import { jobRecommendations } from '@/mock/jobData';
import { useState } from 'react';
import JobCard from '@/components/ui/JobCard';

export default function JobRecommendationsSection() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  return (
    <section className="w-full px-4 py-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-title-xlarge text-gray-80">오늘의 일자리 추천</h2>
          <a
            href="/job-postings"
            className="text-primary-300 hover:text-primary-600 transition-colors"
          >
            더보기
          </a>
        </div>

        <div className="flex flex-row gap-6">
          <div className="flex flex-col gap-6 flex-1">
            {jobRecommendations.slice(0, 4).map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isFavorited={favorites.has(job.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
          <div className="flex flex-col gap-6 flex-1">
            {jobRecommendations.slice(4, 8).map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isFavorited={favorites.has(job.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
