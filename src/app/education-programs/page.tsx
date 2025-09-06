'use client';

import JobCard from '@/components/card-component/JobCard';
import SearchBar from '@/components/ui/SearchBar';
import { jobRecommendations } from '@/mock/jobData';
import { useState } from 'react';

export default function EducationPrograms() {
  const toggleScrap = (jobId: string) => {
    // 스크랩 토글 로직 구현
    console.log('Toggle scrap for job:', jobId);
  };
  return (
    <main className="min-h-screen bg-white">
      <section className="w-full px-4 py-8">
        <div className="max-w-[1200px] mx-auto">
          <SearchBar />
          <div className="flex flex-row gap-6 mt-12">
            <div className="flex flex-col gap-6 flex-1">
              {jobRecommendations.slice(0, 4).map((job) => (
                <JobCard key={job.id} job={job} onToggleScrap={toggleScrap} />
              ))}
            </div>
            <div className="flex flex-col gap-6 flex-1">
              {jobRecommendations.slice(4, 8).map((job) => (
                <JobCard key={job.id} job={job} onToggleScrap={toggleScrap} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
