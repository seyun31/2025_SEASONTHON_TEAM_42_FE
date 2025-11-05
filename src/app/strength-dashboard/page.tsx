'use client';

import { useState, useEffect } from 'react';
import { getUserData } from '@/lib/auth';
import EditableStrengthReportCard from '@/app/_components/features/report/EditableStrengthReportCard';
import Image from 'next/image';

export default function StrengthDashboard() {
  const [userData, setUserData] = useState<{
    userId: number;
    name: string;
    socialProvider: string;
    socialId: string;
    email: string;
    profileImage: string;
  } | null>(null);

  useEffect(() => {
    const user = getUserData();
    if (user) {
      setUserData(user);
    }
  }, []);

  // Mock 데이터
  const strengthReports = [
    {
      title: '경험 및 프로젝트',
      experience: '웹 개발 프로젝트 3개 완료, 팀 협업 경험 다수',
      keywords: ['리더십', '문제해결', '커뮤니케이션'],
      jobs: [
        '28년간 소방관으로 근무하며 수많은 재난 현장에서 위기 상황을 직접 마주했습니다.그 속에서 가장 중요한 것은 언제나 침착함과 명확한 우선순위 판단이었습니다.예측 불가능한 상황에서도 차분히 상황을 분석하고, 한정된 시간 안에 최선의 결정을 내리는 법을 배웠습니다.또한 다양한 조직과 협업하며 문제를 해결하는 과정에서 소통력과 리더십을 길렀습니다.이러한 경험을 바탕으로 어떤 환경에서도 냉철하게 판단하고 안정적으로 이끄는 인재로 성장하겠습니다.',
      ],
      iconType: 'dart' as const,
    },
    {
      title: '기술 역량',
      experience: 'React, TypeScript, Next.js 활용한 개발 경험',
      keywords: ['기술습득력', '코드품질', '최신기술'],
      jobs: ['웹 개발자', 'UI 개발자'],
      iconType: 'check' as const,
    },
    {
      title: '소프트 스킬',
      experience: '팀 프로젝트에서 원활한 소통과 협업 수행',
      keywords: ['협업능력', '의사소통', '책임감'],
      jobs: ['프로젝트 매니저', '팀 리더'],
      iconType: 'memo' as const,
    },
    {
      title: '성장 가능성',
      experience: '새로운 기술 습득에 적극적이며 빠른 학습 능력',
      keywords: ['학습능력', '성장마인드', '도전정신'],
      jobs: ['주니어 개발자', '인턴 개발자'],
      iconType: 'led' as const,
    },
  ];

  const handleGenerateReport = () => {
    window.location.href = '/ai-chat/job'; // AI 직업 진단 페이지로 이동
  };

  const noReport =
    !userData || !strengthReports || strengthReports.length === 0;

  if (noReport) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center text-center">
        <Image
          src="/assets/logos/report-star.svg"
          alt="No Report"
          width={328}
          height={293}
          className="mb-16"
        />
        <button
          onClick={handleGenerateReport}
          className="w-[389px] bg-primary-90 text-white rounded-[24px] p-5 font-pretendard font-semibold text-[36px] leading-[140%] tracking-[-0.025em] text-center cursor-pointer"
          style={{ letterSpacing: '-2.5%' }}
        >
          강점 리포트 생성하러가기
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 py-6 md:py-8">
      <div className="max-w-[1200px] mx-auto mb-27">
        {/* 타이틀 - 반응형 개선 */}
        <h2 className="text-2xl md:text-[32px] lg:text-[36px] text-black text-left mb-6 md:mb-10 lg:mb-13.5 font-semibold leading-[140%] tracking-[-0.025em]">
          {userData?.name || '사용자'}님의 강점 리포트
        </h2>

        {/* 강점 리포트 카드 그리드 - 반응형 레이아웃 */}
        <div className="md:ml-25 grid grid-cols-1 gap-4 md:gap-27 flex-wrap">
          {strengthReports.map((report, index) => (
            <EditableStrengthReportCard
              key={index}
              title={report.title}
              experience={report.experience}
              keywords={report.keywords}
              jobs={report.jobs}
              iconType={report.iconType}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
