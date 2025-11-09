import { cookies } from 'next/headers';
import StrengthDashboardClient from './_components/StrengthDashboardClient';

interface StrengthReport {
  strengthReportId: number;
  strength: string;
  experience: string;
  keyword: string[];
  job: string[];
  appeal: string;
}

async function fetchStrengthReports(): Promise<{
  reports: StrengthReport[];
  userName: string | null;
}> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken || !backendUrl) {
    return { reports: [], userName: null };
  }

  try {
    const response = await fetch(`${backendUrl}/reports/strength/all`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // 항상 최신 리포트 데이터
    });

    if (!response.ok) {
      return { reports: [], userName: null };
    }

    const result = await response.json();

    if (result.result !== 'SUCCESS' || !result.data?.reportList) {
      return { reports: [], userName: null };
    }

    // 사용자 정보도 가져오기
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
      reports: result.data.reportList,
      userName,
    };
  } catch (error) {
    console.error('Error fetching strength reports:', error);
    return { reports: [], userName: null };
  }
}

export default async function StrengthDashboard() {
  const { reports, userName } = await fetchStrengthReports();

  // 로딩 상태는 서버에서 필요 없음 (이미 데이터를 가져온 상태)
  // 클라이언트 컴포넌트에서 즉시 렌더링

  return (
    <StrengthDashboardClient initialReports={reports} userName={userName} />
  );
}
