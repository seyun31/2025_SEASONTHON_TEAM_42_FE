'use client';

import AICoachSection from '@/components/sections/AICoachSection';
import CareerRoadmapSection from '@/components/sections/CareerRoadmapSection';
import JobRecommendationsSection from '@/components/sections/JobRecommendationsSection';
// import EducationRecommendationsSection from '@/components/sections/EducationRecommendationsSection';
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
