'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserData } from '@/lib/auth';
import { getRoadMap } from '@/lib/api/jobApi';
import { RoadMapResponse } from '@/types/roadmap';
import { aiCoachCards } from '@/data/aiCoachData';
import { IoIosArrowForward } from 'react-icons/io';
import RoadmapBackground from '@/components/ui/RoadmapBackground';
import RoadmapHeader from '@/components/ui/RoadmapHeader';
import RoadmapPosition from '@/components/ui/RoadmapPosition';
import {
  convertApiDataToRoadmapSteps,
  USER_MAP_POSITIONS,
} from '@/lib/utils/roadmapUtils';

export default function AICoachRoadmapSection() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [roadmapData, setRoadmapData] = useState<RoadMapResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);

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
      const data = await getRoadMap();
      setRoadmapData(data);
    } catch (err) {
      console.error('로드맵 데이터 가져오기 실패:', err);
      setError('로드맵을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartClick = (cardId: string) => {
    if (cardId === 'second-career') {
      router.push('/ai-chat/job');
    } else {
      router.push('/ai-chat/roadmap');
    }
  };

  // API 데이터를 UI용 데이터로 변환
  const roadmapSteps = convertApiDataToRoadmapSteps(
    roadmapData,
    USER_MAP_POSITIONS
  );

  const handleStepClick = (stepId: number) => {
    setSelectedStepId(stepId);
    // 로드맵 상세 페이지로 이동
    router.push('/career-roadmap');
  };

  return (
    <section className="w-full px-4 py-8">
      <div className="max-w-[1200px] mx-auto">
        {/* 메인 타이틀 */}
        <h2 className="text-2xl md:text-4xl font-semibold text-gray-80 mb-8 text-left">
          AI 코치와 함께 <br className="md:hidden" /> 넥스트 커리어를
          준비해봐요!
        </h2>

        {/* 메인 콘텐츠 영역 - 2:1 비율 */}
        <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
          {/* 좌측 AI 코치 카드들 */}
          <div className="flex flex-col gap-6 lg:w-2/3">
            {aiCoachCards.map((card, index) => (
              <div
                key={card.id}
                className="relative bg-white rounded-3xl px-5 py-6 text-gray-80 overflow-hidden h-52 md:h-72 w-full flex-shrink-0 cursor-pointer hover:bg-[#E1F5EC] transition-transform duration-300"
                onClick={() => handleStartClick(card.id)}
                style={{
                  border: '4px solid #E1F5EC',
                  boxShadow: '0 4px 10px 0 rgba(17, 17, 17, 0.20)',
                }}
              >
                <div className="relative z-10 h-full flex flex-col">
                  <h3 className="text-xl md:text-3xl font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-xl md:text-3xl font-semibold text-primary-90 flex-1">
                    {card.subtitle}
                  </p>
                  <button className="text-gray-80 rounded-lg font-medium flex flex-row items-center gap-2 self-start">
                    시작하기
                    <IoIosArrowForward className="w-4 h-4" />
                  </button>
                </div>

                {/* 캐릭터 이미지 - 모바일: 오른쪽 아래, 데스크톱: 중앙 */}
                <div className="absolute right-4 bottom-4 md:top-1/2 md:transform md:-translate-y-1/2 z-20">
                  <Image
                    src={
                      index % 2 === 0
                        ? '/assets/Icons/character_hi.webp'
                        : '/assets/Icons/character_running.webp'
                    }
                    alt={`캐릭터 ${index % 2 === 0 ? 'hi' : 'running'}`}
                    width={160}
                    height={160}
                    className="w-auto h-20 md:h-50 object-contain"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 우측 로드맵 카드 */}
          <div className="lg:w-1/3 lg:self-start">
            <RoadmapBackground
              className="w-full flex-shrink-0"
              overlayBlur={!userName}
            >
              <RoadmapHeader
                userName={userName}
                showDetailLink={!!userName}
                onDetailClick={() => router.push('/career-roadmap')}
              />

              {/* 로드맵 차트 또는 로그인 안내 */}
              <div
                className="relative w-full"
                style={{ aspectRatio: '445 / 652' }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {!userName ? (
                    <div className="text-center bg-white/40 rounded-2xl px-3 py-2 flex items-center gap-3 ">
                      <p className="text-black text-xl opacity-90">
                        로그인 하시고
                        <br />
                        커리어 로드맵 받아보세요!
                      </p>
                    </div>
                  ) : loading ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-center bg-white/40 rounded-2xl px-6 py-8">
                      <Image
                        src="/assets/Icons/loading-star-2.png"
                        alt="로드맵 불러오는 중"
                        width={160}
                        height={160}
                        className="w-28 h-28 md:w-32 md:h-32 object-contain"
                        priority
                      />
                      <p className="text-black text-xl opacity-90">
                        로드맵을 불러오고 있어요
                      </p>
                    </div>
                  ) : error ? (
                    <div className="text-center bg-white/40 rounded-2xl px-3 py-2 flex items-center gap-3">
                      <p className="text-black text-title-xlarge opacity-90">
                        {error}
                      </p>
                    </div>
                  ) : (
                    <div className="relative h-full w-full">
                      {/* 연결선들 */}
                      <svg
                        className="absolute inset-0 w-full h-full z-10"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        {roadmapSteps.length > 0
                          ? roadmapSteps.map((step, index) => {
                              if (index === roadmapSteps.length - 1)
                                return null;
                              const nextStep = roadmapSteps[index + 1];
                              return (
                                <path
                                  key={`line-${index}`}
                                  d={`M ${step.position.x} ${step.position.y} L ${nextStep.position.x} ${nextStep.position.y}`}
                                  stroke="white"
                                  strokeWidth={2}
                                  fill="none"
                                />
                              );
                            })
                          : null}
                      </svg>

                      {/* 로드맵 단계들 */}
                      {roadmapSteps.length > 0
                        ? roadmapSteps.map((step) => (
                            <div
                              key={step.id}
                              className="absolute flex flex-col items-center z-20"
                              style={{
                                left: `${step.position.x}%`,
                                top: `${step.position.y}%`,
                                transform: 'translate(-50%, -50%)',
                              }}
                            >
                              <div className="mb-2">
                                <RoadmapPosition
                                  isCompleted={step.completed}
                                  isPressed={selectedStepId === step.id}
                                  onClick={() => handleStepClick(step.id)}
                                />
                              </div>
                              <span
                                className="text-white text-4xl whitespace-nowrap font-regular"
                                style={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '60px',
                                  transform: 'translateY(-50%)',
                                }}
                              >
                                {step.name}
                              </span>
                            </div>
                          ))
                        : null}
                    </div>
                  )}
                </div>
              </div>
            </RoadmapBackground>
          </div>
        </div>
      </div>
    </section>
  );
}
