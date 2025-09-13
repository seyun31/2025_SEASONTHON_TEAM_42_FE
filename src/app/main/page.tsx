'use client';

import AICoachSection from '@/components/features/chat/AICoachSection';
import CareerRoadmapSection from '@/components/features/roadmap/CareerRoadmapSection';
import JobRecommendationsSection from '@/components/features/job/JobRecommendationsSection';
// import EducationRecommendationsSection from '@/components/features/roadmap/EducationRecommendationsSection';
import Footer from '@/components/layout/Footer';

export default function Main() {
  return (
    <div>
      <main className="min-h-screen bg-white">
        <AICoachSection />

        <CareerRoadmapSection />

        <JobRecommendationsSection />

        {/* <EducationRecommendationsSection /> */}
      </main>
      <Footer />
    </div>
  );
}
