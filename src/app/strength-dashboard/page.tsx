'use client';

import { useState, useEffect } from 'react';
import { getUserData } from '@/lib/auth';
import EditableStrengthReportCard from '@/app/_components/features/report/EditableStrengthReportCard';
import Image from 'next/image';
import { api } from '@/lib/api/axios';
import { ArrowDownToLine } from 'lucide-react';

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
  const [isDownloadMode, setIsDownloadMode] = useState(false);
  const [selectedReports, setSelectedReports] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    const user = getUserData();
    if (user) {
      setUserData(user);
    }
  }, []);

  const fetchStrengthReports = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get<{
        result: string;
        data: { reportList: StrengthReport[] };
        error?: { code: string; message: string };
      }>('/report/strength-all');

      // 데이터 추출
      let reports: StrengthReport[] = [];

      if (data.result === 'SUCCESS' && data.data?.reportList) {
        reports = data.data.reportList;
      }
      setStrengthReports(reports);
    } catch (error) {
      console.error('Error fetching strength reports:', error);
      setStrengthReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStrengthReports();
  }, []);

  const handleGenerateReport = () => {
    window.location.href = '/ai-chat/job'; // AI 직업 진단 페이지로 이동
  };

  const handleDownloadButtonClick = () => {
    setIsDownloadMode(!isDownloadMode);
    if (isDownloadMode) {
      // 다운로드 모드를 종료하면 선택 초기화
      setSelectedReports(new Set());
    }
  };

  const handleReportSelect = (reportId: number) => {
    const newSelected = new Set(selectedReports);
    if (newSelected.has(reportId)) {
      newSelected.delete(reportId);
    } else {
      newSelected.add(reportId);
    }
    setSelectedReports(newSelected);
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
            className="mb-8 md:mb-16 w-[200px] h-auto md:w-[328px]"
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
      <div className="w-full h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <Image
          src="/assets/logos/report-star.svg"
          alt="No Report"
          width={328}
          height={293}
          className="mb-8 md:mb-16 w-[200px] h-auto md:w-[328px]"
        />
        <button
          onClick={handleGenerateReport}
          className="max-w-[389px] bg-primary-90 text-white rounded-[16px] md:rounded-[24px] p-4 md:p-5 font-pretendard font-semibold text-[20px] md:text-[36px] leading-[140%] tracking-[-0.025em] text-center cursor-pointer"
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
        {/* 타이틀과 버튼을 가로로 배치 */}
        <div className="flex flex-row items-center justify-between gap-2 md:gap-6 mb-6 md:mb-10 lg:mb-13.5">
          {/* 타이틀 - 반응형 개선 */}
          <h2 className="text-2xl md:text-[32px] lg:text-[36px] text-black text-left font-semibold leading-[140%] tracking-[-0.025em] flex-shrink">
            {userData?.name || '사용자'}님의{' '}
            <span style={{ color: '#00AD38' }}>강점 리포트</span>
          </h2>
          {/* 강점 리포트 다운로드 */}
          <button
            onClick={handleDownloadButtonClick}
            className="flex items-center justify-center gap-2 bg-primary-90 text-white rounded-[8px] md:rounded-[12px] font-medium leading-[150%] tracking-[-0.025em] cursor-pointer whitespace-nowrap w-[120px] md:w-[185px] h-[40px] md:h-[54px] flex-shrink-0"
            style={{
              padding: '8px 12px',
              opacity: 1,
              letterSpacing: '-2.5%',
            }}
          >
            {isDownloadMode ? (
              <>
                <span className="font-pretendard font-medium text-[14px] md:text-[20px] leading-[150%] tracking-[-0.025em]">
                  PDF 다운로드
                </span>
                <ArrowDownToLine className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </>
            ) : (
              <span className="font-pretendard font-medium text-[14px] md:text-[20px] leading-[150%] tracking-[-0.025em]">
                강점 리포트 다운로드
              </span>
            )}
          </button>
        </div>

        {/* 강점 리포트 카드 그리드 - 반응형 레이아웃 */}
        <div className="md:ml-25 grid grid-cols-1 gap-5 md:gap-27 flex-wrap">
          {Array.isArray(strengthReports) &&
            strengthReports.map((report, index) => (
              <EditableStrengthReportCard
                key={report.strengthReportId}
                strengthReportId={report.strengthReportId}
                title={report.strength}
                experience={report.experience}
                keywords={report.keyword}
                jobs={[report.appeal]}
                iconType={getIconType(index)}
                showSelectionIcon={isDownloadMode}
                isSelected={selectedReports.has(report.strengthReportId)}
                onSelect={() => handleReportSelect(report.strengthReportId)}
                onDelete={fetchStrengthReports}
                onUpdate={fetchStrengthReports}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
