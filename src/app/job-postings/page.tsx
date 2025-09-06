'use client';

import JobCard from '@/components/card-component/JobCard';
import SearchBar from '@/components/ui/SearchBar';
import JobTab from '@/components/ui/JobTab';
import { jobRecommendations } from '@/mock/jobData';
import { useState } from 'react';

export default function JobPostings() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'custom' | 'all'>('custom');

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
    <main className="min-h-screen bg-white">
      <section className="w-full px-4 py-8">
        <div className="max-w-[1200px] mx-auto">
          <SearchBar />
          <JobTab activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="flex flex-row gap-6 mt-12">
            <div className="flex flex-col gap-6 flex-1">
              {jobRecommendations.slice(0, 4).map((job) => (
                <JobCard
                  key={job.jobId}
                  job={job}
                  onToggleScrap={toggleScrap}
                />
              ))}
            </div>
            <div className="flex flex-col gap-6 flex-1">
              {jobRecommendations.slice(4, 8).map((job) => (
                <JobCard
                  key={job.jobId}
                  job={job}
                  onToggleScrap={toggleScrap}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
