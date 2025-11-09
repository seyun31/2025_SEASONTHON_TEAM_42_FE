'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Footer from '@/components/layout/Footer';
import JobCardSkeleton from '@/components/ui/JobCardSkeleton';

// 모든 섹션을 client-side only로 로드하여 hydration 이슈 방지
const AICoachRoadmapSection = dynamic(
  () => import('@/components/features/chat/AICoachRoadmapSection'),
  {
    ssr: false,
    loading: () => (
      <section className="w-full px-4 py-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="h-8 bg-gray-200 rounded w-96 mb-8 animate-pulse" />
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex flex-col gap-6 lg:w-2/3">
              <div className="h-52 md:h-72 bg-gray-200 rounded-3xl animate-pulse" />
              <div className="h-52 md:h-72 bg-gray-200 rounded-3xl animate-pulse" />
            </div>
            <div className="lg:w-1/3">
              <div className="aspect-[445/652] bg-gray-200 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    ),
  }
);

const JobRecommendationsSection = dynamic(
  () => import('@/components/features/job/JobRecommendationsSection'),
  {
    ssr: false,
    loading: () => (
      <section className="w-full px-4 py-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-96 animate-pulse" />
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-6 w-full md:w-[calc(50%-12px)]">
              {Array.from({ length: 4 }).map((_, index) => (
                <JobCardSkeleton key={index * 2} />
              ))}
            </div>
            <div className="flex flex-col gap-6 w-full md:w-[calc(50%-12px)]">
              {Array.from({ length: 4 }).map((_, index) => (
                <JobCardSkeleton key={index * 2 + 1} />
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  }
);

const EducationRecommendationsSection = dynamic(
  () => import('@/components/features/roadmap/EducationRecommendationsSection'),
  { ssr: false }
);

export default function MainClient() {
  return (
    <div>
      <main className="min-h-screen bg-white">
        <AICoachRoadmapSection />

        <Suspense fallback={null}>
          <JobRecommendationsSection />
        </Suspense>

        <EducationRecommendationsSection />
      </main>
      <Footer />
    </div>
  );
}
