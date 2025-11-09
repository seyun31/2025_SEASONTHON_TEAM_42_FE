'use client';

import { useEffect, useState, useCallback } from 'react';
import { getUserData } from '@/lib/auth';
import { useRoadmapStore } from '@/stores/roadmapStore';
import UserCheckList from '@/components/features/roadmap/UserCheckList';
import Footer from '@/components/layout/Footer';
import { getRoadMap } from '@/lib/api/jobApi';
import { RoadMapResponse } from '@/types/roadmap';

interface CareerRoadmapClientProps {
  initialRoadmapData: RoadMapResponse | null;
  initialUserName: string | null;
  initialHasRoadmap: boolean;
}

export default function CareerRoadmapClient({
  initialRoadmapData,
  initialUserName,
  initialHasRoadmap,
}: CareerRoadmapClientProps) {
  const [userName, setUserName] = useState<string>(initialUserName || '');
  const [roadmapData, setRoadmapData] = useState<RoadMapResponse | null>(
    initialRoadmapData
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { hasRoadmap, setHasRoadmap } = useRoadmapStore();

  useEffect(() => {
    // 초기 hasRoadmap 상태 설정
    setHasRoadmap(initialHasRoadmap);
  }, [initialHasRoadmap, setHasRoadmap]);

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
    }

    // 클라이언트에서 최신 로드맵 데이터 가져오기
    fetchRoadmapData();
  }, [fetchRoadmapData]);

  return (
    <div>
      <section className="w-full px-4 py-8 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        <div className="max-w-[1200px] mx-auto w-full">
          {/* 로그인 여부와 관계없이 UserCheckList 사용 */}
          <UserCheckList
            userName={userName}
            hasRoadmap={hasRoadmap}
            roadmapData={roadmapData}
            onRoadmapUpdate={fetchRoadmapData}
            isLoading={isLoading}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
