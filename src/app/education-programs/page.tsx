'use client';

import JobCard from '@/components/ui/JobCard';
import SearchBar from '@/components/ui/SearchBar';
import { jobRecommendations } from '@/mock/jobData';
import { useState } from 'react';

export default function EducationPrograms() {
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
    <main className="min-h-screen bg-white">
      <section className="w-full px-4 py-8">
        <div className="max-w-[1200px] mx-auto">
          <SearchBar />
          <div className="flex flex-row gap-6 mt-12">
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
    </main>
  );
}
