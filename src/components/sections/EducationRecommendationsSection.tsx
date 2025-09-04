'use client';

import { educationRecommendations } from '@/mock/educationData';
import type { EducationRecommendation } from '@/mock/educationData';
import { jobRecommendations, type JobRecommendation } from '@/mock/jobData';
import { useState, useEffect } from 'react';
import JobCard from '@/components/ui/JobCard';
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

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  // Convert education data to job format for JobCard compatibility
  const convertEducationToJob = (
    education: EducationRecommendation
  ): JobRecommendation => ({
    id: education.id,
    companyLogo: education.institutionLogo,
    companyName: education.institutionName,
    location: education.location,
    tags: ['교육', '프로그램', '과정'],
    title: education.description,
    deadline: education.deadline,
    deadlineDate: education.deadline,
    experience: '신입',
    salary: education.cost,
    workPeriod: education.duration,
    employmentType: '교육',
    applicationDeadline: education.deadline,
    sessionCount: '12회',
    educationPeriod: education.duration,
    amount: education.cost,
    recommendationScore: 0,
    isFavorited: education.isFavorited,
  });

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
