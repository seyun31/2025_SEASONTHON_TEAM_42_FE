'use client';

import { useEffect, useState } from 'react';
import { getUserData } from '@/lib/auth';
import { useRoadmapStore } from '@/stores/roadmapStore';
import UserMap from '@/components/roadmap/UserMap';
import UserCheckList from '@/components/roadmap/UserCheckList';
import Footer from '@/components/layout/Footer';
import { getRoadMap } from '@/apis/jobApi';
import { RoadMapResponse } from '@/types/roadmap';
export default function CareerRoadmap() {
  const [userName, setUserName] = useState<string>('');
  const [roadmapData, setRoadmapData] = useState<RoadMapResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { hasRoadmap, setHasRoadmap } = useRoadmapStore();

  useEffect(() => {
    const userData = getUserData();
    if (userData?.name) {
      setUserName(userData.name);
      // 로그인한 사용자의 경우 로드맵 데이터 가져오기
      fetchRoadmapData();
    }
  }, []);

  const fetchRoadmapData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRoadMap();
      setRoadmapData(data);
      setHasRoadmap(true);
    } catch (err) {
      console.error('로드맵 데이터 가져오기 실패:', err);
      setError(
        err instanceof Error
          ? err.message
          : '로드맵 데이터를 가져올 수 없습니다.'
      );
      setHasRoadmap(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="w-full px-4 py-8">
        <div className="max-w-[1200px] mx-auto">
          {!userName ? (
            // 로그인하지 않은 경우
            <div
              className="relative rounded-2xl p-8 text-white overflow-hidden h-[420px] w-[1200px] flex-shrink-0"
              style={{
                backgroundImage: 'url(/assets/Icons/roadmap_bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
              }}
            >
              {/* 배경 오버레이 */}
              <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>

              {/* 콘텐츠 */}
              <div className="relative z-10 h-full flex flex-col">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-8">
                  <div className="bg-white/40 rounded-2xl px-3 py-2 flex items-center gap-3">
                    <span className="text-black text-title-medium">
                      취업 로드맵
                    </span>
                  </div>
                </div>

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
              </div>
            </div>
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
