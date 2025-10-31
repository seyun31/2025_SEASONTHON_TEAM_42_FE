'use client';

import { useEffect, useState, useCallback } from 'react';
import { getUserData } from '@/lib/auth';
import { useRoadmapStore } from '@/stores/roadmapStore';
import UserCheckList from '@/components/features/roadmap/UserCheckList';
import Footer from '@/components/layout/Footer';
import { getRoadMap } from '@/lib/api/jobApi';
import { RoadMapResponse } from '@/types/roadmap';
import RoadmapBackground from '@/components/ui/RoadmapBackground';
import RoadmapHeader from '@/components/ui/RoadmapHeader';
export default function CareerRoadmap() {
  const [userName, setUserName] = useState<string>('');
  const [roadmapData, setRoadmapData] = useState<RoadMapResponse | null>(null);
  const { hasRoadmap, setHasRoadmap } = useRoadmapStore();

  const fetchRoadmapData = useCallback(async () => {
    try {
      const data = await getRoadMap();
      setRoadmapData(data);
      setHasRoadmap(true);
    } catch (err) {
      console.error('로드맵 데이터 가져오기 실패:', err);
      setHasRoadmap(false);
    }
  }, [setHasRoadmap]);

  useEffect(() => {
    const userData = getUserData();
    if (userData?.name) {
      setUserName(userData.name);
      // 로그인한 사용자의 경우 로드맵 데이터 가져오기
      fetchRoadmapData();
    }
  }, [fetchRoadmapData]);

  return (
    <div>
      <section className="w-full px-4 py-8">
        <div className="max-w-[1200px] mx-auto">
          {!userName ? (
            // 로그인하지 않은 경우
            <RoadmapBackground className="h-[420px] w-[1200px] flex-shrink-0">
              <RoadmapHeader />

              {/* 로그인 안내 */}
              <div className="flex-1 relative flex items-center justify-center">
                <div className="text-center bg-white/40 rounded-2xl px-3 py-2 flex items-center gap-3">
                  <p className="text-black text-title-xlarge opacity-90">
                    로그인 하시고
                    <br />
                    취업 로드맵 받아보세요!
                  </p>
                </div>
              </div>
            </RoadmapBackground>
          ) : (
            // 로그인한 경우 (로드맵 있음/없음 모두 UserCheckList 사용)
            <UserCheckList
              userName={userName}
              hasRoadmap={hasRoadmap}
              roadmapData={roadmapData}
              onRoadmapUpdate={fetchRoadmapData}
            />
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
