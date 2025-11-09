import { cookies } from 'next/headers';
import CareerRoadmapClient from './_components/CareerRoadmapClient';
import { RoadMapResponse } from '@/types/roadmap';

async function fetchRoadmapData(): Promise<{
  roadmapData: RoadMapResponse | null;
  userName: string | null;
  hasRoadmap: boolean;
}> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken || !backendUrl) {
    return { roadmapData: null, userName: null, hasRoadmap: false };
  }

  try {
    // 로드맵 데이터 가져오기
    const roadmapResponse = await fetch(`${backendUrl}/roadmap`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // 항상 최신 로드맵 데이터
    });

    let roadmapData = null;
    let hasRoadmap = false;

    if (roadmapResponse.ok) {
      const roadmapResult = await roadmapResponse.json();
      if (roadmapResult.result === 'SUCCESS' && roadmapResult.data) {
        roadmapData = roadmapResult.data;
        hasRoadmap = true;
      }
    }

    // 사용자 정보 가져오기
    const userResponse = await fetch(`${backendUrl}/v1/member`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    let userName = null;
    if (userResponse.ok) {
      const userResult = await userResponse.json();
      if (userResult.result === 'SUCCESS' && userResult.data?.name) {
        userName = userResult.data.name;
      }
    }

    return {
      roadmapData,
      userName,
      hasRoadmap,
    };
  } catch (error) {
    console.error('Error fetching roadmap data:', error);
    return { roadmapData: null, userName: null, hasRoadmap: false };
  }
}

export default async function CareerRoadmap() {
  const { roadmapData, userName, hasRoadmap } = await fetchRoadmapData();

  return (
    <CareerRoadmapClient
      initialRoadmapData={roadmapData}
      initialUserName={userName}
      initialHasRoadmap={hasRoadmap}
    />
  );
}
