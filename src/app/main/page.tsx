'use client';

import AICoachRoadmapSection from '@/components/features/chat/AICoachRoadmapSection';
import JobRecommendationsSection from '@/components/features/job/JobRecommendationsSection';
import EducationRecommendationsSection from '@/components/features/roadmap/EducationRecommendationsSection';
import Footer from '@/components/layout/Footer';

export default function Main() {
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
