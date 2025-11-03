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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { hasRoadmap, setHasRoadmap } = useRoadmapStore();

  const fetchRoadmapData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getRoadMap();
      setRoadmapData(data);
      setHasRoadmap(true);
    } catch (err) {
      console.error('로드맵 데이터 가져오기 실패:', err);
      setHasRoadmap(false);
    } finally {
      setIsLoading(false);
    }
  }, [setHasRoadmap]);

  useEffect(() => {
    const userData = getUserData();
    if (userData?.name) {
      setUserName(userData.name);
      // 로그인한 사용자의 경우 로드맵 데이터 가져오기
      fetchRoadmapData();
    } else {
      setIsLoading(false);
    }
  }, [fetchRoadmapData]);

  return (
    <div>
      <section className="w-full px-4 py-8">
        <div className="max-w-[1200px] mx-auto">
          {!userName ? (
            // 로그인하지 않은 경우
            <RoadmapBackground className="w-full aspect-[588/860]">
              <RoadmapHeader />

              {/* 로그인 안내 */}
              <div className="flex-1 relative flex items-center justify-center px-2">
                <div className="text-center bg-white/40 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-3">
                  <p className="text-black text-lg sm:text-title-large xl:text-title-xlarge opacity-90 font-bold">
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
              isLoading={isLoading}
            />
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
