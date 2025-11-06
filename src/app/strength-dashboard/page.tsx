'use client';

import { useState, useEffect } from 'react';
import { getUserData } from '@/lib/auth';
import EditableStrengthReportCard from '@/app/_components/features/report/EditableStrengthReportCard';
import Image from 'next/image';

interface StrengthReport {
  strengthReportId: number;
  strength: string;
  experience: string;
  keyword: string[];
  job: string[];
  appeal: string;
}

export default function StrengthDashboard() {
  const [userData, setUserData] = useState<{
    userId: number;
    name: string;
    socialProvider: string;
    socialId: string;
    email: string;
    profileImage: string;
  } | null>(null);
  const [strengthReports, setStrengthReports] = useState<StrengthReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getUserData();
    if (user) {
      setUserData(user);
    }
  }, []);

  useEffect(() => {
    const fetchStrengthReports = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/report/strength-all');

        if (!response.ok) {
          throw new Error('Failed to fetch strength reports');
        }

        const data = await response.json();

        // 데이터 추출
        let reports = [];

        if (data.result === 'SUCCESS' && data.data?.reportList) {
          reports = data.data.reportList;
        } else if (Array.isArray(data.data)) {
          reports = data.data;
        } else if (Array.isArray(data)) {
          reports = data;
        }
        setStrengthReports(reports);
      } catch (error) {
        console.error('Error fetching strength reports:', error);
        setStrengthReports([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStrengthReports();
  }, []);

  const handleGenerateReport = () => {
    window.location.href = '/ai-chat/job'; // AI 직업 진단 페이지로 이동
  };

  // 아이콘 타입을 순환하여 할당
  const getIconType = (index: number): 'dart' | 'check' | 'memo' | 'led' => {
    const icons: ('dart' | 'check' | 'memo' | 'led')[] = [
      'dart',
      'check',
      'memo',
      'led',
    ];
    return icons[index % icons.length];
  };

  // 로딩 중이면 아무것도 표시하지 않음
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white/60 backdrop-blur-lg z-40 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/assets/Icons/character_running.webp"
            alt="loading"
            width={328}
            height={293}
            className="mb-16"
          />
          <p className="text-2xl md:text-3xl font-semibold text-gray-50">
            강점 리포트 불러오는중
          </p>
        </div>
      </div>
    );
  }

  const noReport = !strengthReports || strengthReports.length === 0;

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
          {Array.isArray(strengthReports) &&
            strengthReports.map((report, index) => (
              <EditableStrengthReportCard
                key={report.strengthReportId}
                title={report.strength}
                experience={report.experience}
                keywords={report.keyword}
                jobs={[report.appeal]}
                iconType={getIconType(index)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
