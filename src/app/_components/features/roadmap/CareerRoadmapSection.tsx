'use client';

import { useEffect, useState } from 'react';
import { getUserData } from '@/lib/auth';
import { getRoadMap } from '@/lib/api/jobApi';
import { RoadMapResponse } from '@/types/roadmap';
import RoadmapBackground from '@/components/ui/RoadmapBackground';
import RoadmapHeader from '@/components/ui/RoadmapHeader';
import RoadmapRenderer from '@/components/ui/RoadmapRenderer';
import StarIcon from '@/components/ui/StarIcon';
import {
  convertApiDataToRoadmapSteps,
  CAREER_ROADMAP_POSITIONS,
} from '@/lib/utils/roadmapUtils';

export default function CareerRoadmapSection() {
  const [userName, setUserName] = useState<string>('');
  const [roadmapData, setRoadmapData] = useState<RoadMapResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userData = getUserData();
    if (userData?.name) {
      setUserName(userData.name);
      // 사용자가 로그인되어 있으면 로드맵 데이터 가져오기
      fetchRoadmapData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchRoadmapData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRoadMap();
      setRoadmapData(data);
    } catch (err) {
      console.error('로드맵 데이터 가져오기 실패:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('로드맵을 불러올 수 없습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // API 데이터를 UI용 데이터로 변환
  const roadmapSteps = convertApiDataToRoadmapSteps(
    roadmapData,
    CAREER_ROADMAP_POSITIONS
  );

  return (
    <section className="w-full px-4 py-8">
      <div className="max-w-[1200px] mx-auto">
        <RoadmapBackground
          className="h-[420px] w-[1200px] flex-shrink-0"
          overlayBlur={!userName}
        >
          <RoadmapHeader userName={userName} showDetailLink={!!userName} />

          {/* 로드맵 차트 또는 로그인 안내 */}
          <div className="flex-1 relative flex items-center justify-center">
            {!userName ? (
              <div className="text-center bg-white/40 rounded-2xl px-3 py-2 flex items-center gap-3">
                <p className="text-black text-title-xlarge opacity-90">
                  로그인 하시고
                  <br />
                  취업 로드맵 받아보세요!
                </p>
              </div>
            ) : loading ? (
              <div className="text-center bg-white/40 rounded-2xl px-3 py-2 flex items-center gap-3">
                <p className="text-black text-title-xlarge opacity-90">
                  로드맵을 불러오는 중...
                </p>
              </div>
            ) : error ? (
              <div className="text-center bg-white/40 rounded-2xl px-3 py-2 flex items-center gap-3">
                <p className="text-black text-title-xlarge opacity-90">
                  {error}
                </p>
              </div>
            ) : (
              <RoadmapRenderer
                roadmapSteps={roadmapSteps}
                strokeColor="#FF0000"
                strokeWidth={4}
                renderStep={(step) => (
                  <>
                    <div className="mb-2">
                      <StarIcon filled={step.completed} size="lg" />
                    </div>
                    <span
                      className="text-white text-title-xlarge whitespace-nowrap"
                      style={{
                        position: 'absolute',
                        top: step.position.y > 50 ? '40px' : '40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }}
                    >
                      {step.name}
                    </span>
                  </>
                )}
              />
            )}
          </div>
        </RoadmapBackground>
      </div>
    </section>
  );
}
