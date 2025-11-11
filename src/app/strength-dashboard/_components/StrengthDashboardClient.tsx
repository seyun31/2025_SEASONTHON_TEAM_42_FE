'use client';

import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getUserData } from '@/lib/auth';
import EditableStrengthReportCard from '@/app/_components/features/report/EditableStrengthReportCard';
import Image from 'next/image';
import { api } from '@/lib/api/axios';
import { ArrowDownToLine } from 'lucide-react';
import { showSuccess, showError } from '@/utils/alert';

interface StrengthReport {
  strengthReportId: number;
  strength: string;
  experience: string;
  keyword: string[];
  job: string[];
  appeal: string;
}

interface StrengthDashboardClientProps {
  initialReports: StrengthReport[];
  userName: string | null;
}

export default function StrengthDashboardClient({
  initialReports,
  userName: initialUserName,
}: StrengthDashboardClientProps) {
  const [userData, setUserData] = useState<{
    userId: number;
    name: string;
    socialProvider: string;
    socialId: string;
    email: string;
    profileImage: string;
  } | null>(null);
  const [strengthReports, setStrengthReports] =
    useState<StrengthReport[]>(initialReports);
  const [isDownloadMode, setIsDownloadMode] = useState(false);
  const [selectedReports, setSelectedReports] = useState<Set<number>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getUserData();
    if (user) {
      setUserData(user);
    }

    // 클라이언트에서 최신 강점 리포트 데이터 가져오기
    fetchStrengthReports();
  }, []);

  // 외부 클릭 감지로 다운로드 모드 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDownloadMode) {
        const target = event.target as HTMLElement;
        // 버튼이나 카드 선택 아이콘이 아닌 경우에만 닫기
        const isButton = target.closest('button');
        const isCard = target.closest('[data-card-selectable]');

        if (!isButton && !isCard) {
          setIsDownloadMode(false);
          setSelectedReports(new Set());
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDownloadMode]);

  const fetchStrengthReports = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<{
        result: string;
        data: { reportList: StrengthReport[] };
        error?: { code: string; message: string };
      }>('/api/report/strength-all');

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

  const handleGenerateReport = () => {
    window.location.href = '/ai-chat/job'; // AI 직업 진단 페이지로 이동
  };

  const handlePdfDownload = async () => {
    if (selectedReports.size === 0) {
      showError('다운로드할 리포트를 선택해주세요');
      return;
    }

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');

      // 선택된 카드 노드들 가져오기
      const allCardNodes = Array.from(
        document.querySelectorAll('.report-card')
      ) as HTMLElement[];

      const selectedCardNodes = allCardNodes.filter((node) => {
        const reportId = node.getAttribute('data-report-id');
        return reportId && selectedReports.has(Number(reportId));
      });

      // 2개씩 페이지 분할
      const chunkSize = 2;
      const chunks: HTMLElement[][] = [];
      for (let i = 0; i < selectedCardNodes.length; i += chunkSize) {
        chunks.push(selectedCardNodes.slice(i, i + chunkSize));
      }

      const userName = userData?.name || initialUserName || '사용자';

      for (let pageIndex = 0; pageIndex < chunks.length; pageIndex++) {
        const pageCards = chunks[pageIndex];

        // 페이지 전용 컨테이너 생성
        const page = document.createElement('div');
        page.style.width = '794px'; // A4 px width
        page.style.minHeight = '1123px'; // A4 height
        page.style.padding = '80px 40px 40px 40px'; // 상단 여백 증가
        page.style.background = 'white';
        page.style.position = 'absolute';
        page.style.top = '-99999px';
        page.style.left = '-99999px';
        page.style.display = 'flex';
        page.style.flexDirection = 'column';
        page.style.gap = '24px';

        document.body.appendChild(page);

        // 헤더 추가 (첫 페이지만)
        if (pageIndex === 0) {
          const header = document.createElement('div');
          header.style.display = 'flex';
          header.style.justifyContent = 'space-between';
          header.style.alignItems = 'center';
          header.style.marginBottom = '8px';

          const title = document.createElement('h1');
          title.style.fontSize = '28px';
          title.style.fontWeight = 'bold';
          title.style.margin = '0';
          title.innerHTML = `${userName}님의 <span style="color: #00AD38;">강점 리포트</span>`;

          const logo = document.createElement('img');
          logo.src = '/assets/logos/name-logo.svg';
          logo.alt = '로고';
          logo.width = 76;
          logo.height = 36;
          logo.style.marginTop = '30px';
          logo.style.marginRight = '8px';

          header.appendChild(title);
          header.appendChild(logo);
          page.appendChild(header);
        }

        // 카드 복사해서 추가
        pageCards.forEach((cardNode) => {
          const clonedCard = cardNode.cloneNode(true) as HTMLElement;

          // 선택 아이콘 제거
          const selectionIcon = clonedCard.querySelector(
            'button[style*="top: -20px"]'
          );
          if (selectionIcon) {
            selectionIcon.remove();
          }

          // 수정/삭제 버튼 제거
          const editButtons = clonedCard.querySelectorAll('button');
          editButtons.forEach((btn) => {
            if (
              btn.textContent?.includes('수정') ||
              btn.textContent?.includes('삭제') ||
              btn.textContent?.includes('저장') ||
              btn.textContent?.includes('취소')
            ) {
              btn.remove();
            }
          });

          page.appendChild(clonedCard);
        });

        // 이미지 로드 대기
        const images = page.getElementsByTagName('img');
        await Promise.all(
          Array.from(images).map(
            (img) =>
              new Promise<void>((resolve) => {
                if (img.complete) {
                  resolve();
                } else {
                  img.onload = () => resolve();
                  img.onerror = () => resolve();
                  setTimeout(() => resolve(), 100);
                }
              })
          )
        );

        // 약간의 딜레이
        await new Promise((resolve) => setTimeout(resolve, 300));

        // 캡처
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
          imageTimeout: 0,
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (pageIndex > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        // 임시 DOM 삭제
        document.body.removeChild(page);
      }

      // 파일명 생성
      const now = new Date();
      const year = String(now.getFullYear()).slice(2);
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dateStr = `${year}${month}${day}`;

      pdf.save(`${userName}_강점리포트_${dateStr}.pdf`);

      showSuccess('PDF 다운로드가 완료되었어요');
      setIsDownloadMode(false);
      setSelectedReports(new Set());
    } catch (error) {
      showError('PDF가 다운로드되지 않았어요');
      console.error('PDF 다운로드 오류:', error);
    }
  };

  const handleDownloadButtonClick = () => {
    if (isDownloadMode) {
      // 다운로드 모드일 때는 PDF 다운로드 실행
      handlePdfDownload();
    } else {
      // 다운로드 모드 활성화
      setIsDownloadMode(true);
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

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <Image
          src="/assets/Icons/loading-star-2.png"
          alt="강점 리포트 불러오는 중"
          width={328}
          height={293}
          className="mb-8 md:mb-16 w-[200px] h-auto md:w-[328px]"
        />
        <p className="text-2xl md:text-3xl font-semibold text-gray-50">
          강점 리포트 불러오는 중
        </p>
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
          className="bg-primary-90 text-white rounded-[16px] md:rounded-[24px] p-4 md:p-5 font-pretendard font-semibold text-lg leading-[140%] tracking-[-0.025em] text-center cursor-pointer"
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
            {userData?.name || initialUserName || '사용자'}님의{' '}
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
              <div key={report.strengthReportId} data-card-selectable>
                <EditableStrengthReportCard
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
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
