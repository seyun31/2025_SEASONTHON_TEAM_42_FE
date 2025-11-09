'use client';

import dynamic from 'next/dynamic';
import AICoachRoadmapSection from '@/components/features/chat/AICoachRoadmapSection';
import Footer from '@/components/layout/Footer';

// 아래 섹션들은 lazy load
const JobRecommendationsSection = dynamic(
  () => import('@/components/features/job/JobRecommendationsSection'),
  { ssr: false }
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

        <JobRecommendationsSection />

        <EducationRecommendationsSection />
      </main>
      <Footer />
    </div>
  );
}
