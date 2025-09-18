'use client';

import Footer from '@/components/layout/Footer';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import JobCard from '@/components/features/job/JobCard';
import EducationCard from '@/components/features/job/EducationCard';
import { JobSummary, EducationSummary } from '@/types/job';

// API 응답 타입 정의
interface JobHistoryItem {
  jobId: number;
  companyName: string;
  jobCodeName: string;
  recruitNumber: number;
  employmentType: string;
  workLocation: string;
  description: string;
  wage: string;
  insurance: string;
  workTime: string;
  managerPhone: string;
  jobTitle: string;
  screeningMethod: string;
  receptionMethod: string;
  requiredDocuments: string;
  jobCategory: string;
  postingDate: string;
  closingDate: string;
  imageUrl?: string;
}

interface JobHistoryResponse {
  result: 'SUCCESS' | 'ERROR';
  data: {
    totalElements: number;
    numberOfElements: number;
    jobDtoList: JobHistoryItem[];
  };
  error?: {
    code: string;
    message: string;
  };
}

// 교육 히스토리 API 응답 타입 정의
interface EducationHistoryItem {
  educationId: number;
  title: string;
  subTitle: string;
  traStartDate: string;
  traEndDate: string;
  address: string;
  courseMan: string;
  keyword1: string;
  keyword2: string;
  trprDegr: string;
  imageUrl: string;
  isBookmark: boolean;
  score: number | null;
}

interface EducationHistoryResponse {
  result: 'SUCCESS' | 'ERROR';
  data: {
    totalElements: number;
    numberOfElements: number;
    educationDtoList: EducationHistoryItem[];
  };
  error?: {
    code: string;
    message: string;
  };
}

function HeartListsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get('tab');
  const [jobHistory, setJobHistory] = useState<JobSummary[]>([]);
  const [educationHistory, setEducationHistory] = useState<EducationSummary[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleTabClick = (tabName: string) => {
    router.push(`/heart-lists?tab=${tabName}`);
  };

  // API 데이터를 JobSummary 형태로 변환하는 함수
  const transformJobHistoryToJobSummary = (
    item: JobHistoryItem
  ): JobSummary => {
    return {
      id: item.jobId,
      jobId: item.jobId.toString(),
      companyName: item.companyName,
      companyLogo: item.imageUrl || '',
      jobTitle: item.jobTitle,
      jobCategory: item.jobCategory,
      workLocation: item.workLocation,
      employmentType: item.employmentType,
      salary: item.wage,
      workPeriod: '',
      experience: '',
      requiredSkills: '',
      preferredSkills: '',
      postingDate: item.postingDate,
      closingDate: item.closingDate,
      applyLink: '',
      requiredDocuments: item.requiredDocuments,
      jobRecommendScore: null,
      isScrap: true,
    };
  };

  // 채용 공고 북마크 히스토리 조회
  const fetchJobHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/heart-lists/job/history');
      const data: JobHistoryResponse = await response.json();

      if (data.result === 'SUCCESS') {
        const transformedJobs = data.data.jobDtoList.map(
          transformJobHistoryToJobSummary
        );
        setJobHistory(transformedJobs);
      } else {
        console.error('채용 공고 히스토리 조회 실패:', data.error);
        setJobHistory([]);
      }
    } catch (error) {
      console.error('채용 공고 히스토리 조회 에러:', error);
      setJobHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 탭이 변경될 때마다 해당 API 호출
  useEffect(() => {
    if (tab === 'jobs') {
      fetchJobHistory();
    } else if (tab === 'education') {
      fetchEducationHistory();
    }
  }, [tab]);

  // 교육 히스토리 데이터를 EducationSummary 형태로 변환하는 함수
  const transformEducationHistoryToEducationSummary = (
    item: EducationHistoryItem
  ): EducationSummary => {
    return {
      id: item.educationId.toString(),
      trprId: item.educationId.toString(),
      title: item.title,
      subTitle: item.subTitle,
      institution: item.subTitle,
      address: item.address,
      traStartDate: item.traStartDate,
      traEndDate: item.traEndDate,
      trainTarget: '',
      contents: '',
      certificate: '',
      grade: '',
      regCourseMan: '',
      courseMan: item.courseMan,
      realMan: '',
      yardMan: '',
      telNo: '',
      stdgScor: '',
      eiEmplCnt3: '',
      eiEmplRate3: '',
      eiEmplCnt3Gt10: '',
      eiEmplRate6: '',
      ncsCd: '',
      trprDegr: item.trprDegr,
      instCd: '',
      trngAreaCd: '',
      trainTargetCd: '',
      trainstCstId: '',
      subTitleLink: '',
      titleLink: '',
      titleIcon: '',
      imageUrl: item.imageUrl,
      isBookmark: item.isBookmark,
      recommendScore: item.score ?? undefined,
    };
  };

  // 교육 공고 북마크 히스토리 조회
  const fetchEducationHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/heart-lists/edu/history');
      const data: EducationHistoryResponse = await response.json();

      if (data.result === 'SUCCESS') {
        const transformedEducations = data.data.educationDtoList.map(
          transformEducationHistoryToEducationSummary
        );
        setEducationHistory(transformedEducations);
      } else {
        console.error('교육 공고 히스토리 조회 실패:', data.error);
        setEducationHistory([]);
      }
    } catch (error) {
      console.error('교육 공고 히스토리 조회 에러:', error);
      setEducationHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 스크랩 토글 핸들러
  const handleToggleScrap = async (jobId: string) => {
    // 스크랩 해제 로직 (필요시 구현)
    console.log('스크랩 토글:', jobId);
  };

  // 교육 북마크 토글 핸들러
  const handleToggleBookmark = async (educationId: string) => {
    // 북마크 해제 로직 (필요시 구현)
    console.log('북마크 토글:', educationId);
    try {
      // 현재 해당 교육의 북마크 상태 찾기
      const currentEducation = educationHistory.find(
        (edu) => edu.trprId === educationId
      );
      if (!currentEducation) return;

      const isCurrentlyBookmarked = currentEducation.isBookmark;
      const endpoint = isCurrentlyBookmarked
        ? `/api/heart-lists/edu/delete?jobId=${educationId}`
        : '/api/heart-lists/edu/save';

      const requestOptions: RequestInit = {
        method: isCurrentlyBookmarked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // POST 요청인 경우에만 body 추가
      if (!isCurrentlyBookmarked) {
        requestOptions.body = JSON.stringify({ jobId: parseInt(educationId) });
      }

      const response = await fetch(endpoint, requestOptions);
      const data = await response.json();

      if (data.result === 'SUCCESS') {
        // 상태 업데이트: 북마크 상태 토글
        setEducationHistory((prevHistory) =>
          prevHistory.map((edu) =>
            edu.trprId === educationId
              ? { ...edu, isBookmark: !isCurrentlyBookmarked }
              : edu
          )
        );
        console.log(
          isCurrentlyBookmarked ? '북마크 해제 성공' : '북마크 추가 성공'
        );
      } else {
        console.error('북마크 토글 실패:', data.error);
      }
    } catch (error) {
      console.error('북마크 토글 에러:', error);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="max-w-[1200px] mx-auto px-4 md:px-0">
          {/* 타이틀 */}
          <h2 className="hidden md:block text-title-xlarge text-black text-left mb-18">
            관심 목록
          </h2>

          {/* 데스크탑 탭 영역 */}
          <div className="hidden lg:flex gap-6 mb-6">
            <div
              className={`px-4 py-2 ${tab === 'jobs' ? 'border-b-3 border-primary-90' : ''}`}
            >
              <button
                className={`pb-2 text-title-xlarge text-left cursor-pointer ${tab === 'jobs' ? 'text-black' : 'text-gray-50 hover:text-black'}`}
                onClick={() => handleTabClick('jobs')}
              >
                채용 공고
              </button>
            </div>
            <div
              className={`px-4 py-2 ${tab === 'education' ? 'border-b-3 border-primary-90' : ''}`}
            >
              <button
                className={`pb-2 text-title-xlarge text-left cursor-pointer ${tab === 'education' ? 'text-black' : 'text-gray-50 hover:text-black'}`}
                onClick={() => handleTabClick('education')}
              >
                교육 공고
              </button>
            </div>
          </div>

          {/* 모바일 탭 영역 */}
          <div className="flex gap-6 mb-6 mt-6 lg:hidden">
            <div
              className={`px-4 py-2 ${tab === 'jobs' ? 'border-b-3 border-primary-90' : ''}`}
            >
              <button
                className={`pb-2 text-xl text-left cursor-pointer ${tab === 'jobs' ? 'text-black' : 'text-gray-50 hover:text-black'}`}
                onClick={() => handleTabClick('jobs')}
              >
                채용 공고
              </button>
            </div>
            <div
              className={`px-4 py-2 ${tab === 'education' ? 'border-b-3 border-primary-90' : ''}`}
            >
              <button
                className={`pb-2 text-xl text-left cursor-pointer ${tab === 'education' ? 'text-black' : 'text-gray-50 hover:text-black'}`}
                onClick={() => handleTabClick('education')}
              >
                교육 공고
              </button>
            </div>
          </div>

          {/* 관심 목록 콘텐츠 영역 */}
          {tab && (
            <div className="flex gap-4 justify-center flex-wrap">
              {tab === 'jobs' ? (
                isLoading ? (
                  <div className="text-center py-16 w-full">
                    <p className="text-gray-50 text-lg">로딩 중...</p>
                  </div>
                ) : jobHistory.length > 0 ? (
                  jobHistory.map((job) => (
                    <JobCard
                      key={job.jobId}
                      job={job}
                      onToggleScrap={handleToggleScrap}
                    />
                  ))
                ) : (
                  <div className="text-center py-16 w-full">
                    <p className="text-gray-60 text-lg">
                      스크랩한 채용 공고가 없습니다.
                    </p>
                    <p className="text-gray-50 text-sm mt-2">
                      채용 공고에서 원하는 공고를 스크랩하세요!
                    </p>
                  </div>
                )
              ) : tab === 'education' ? (
                isLoading ? (
                  <div className="text-center py-16 w-full">
                    <p className="text-gray-50 text-lg">로딩 중...</p>
                  </div>
                ) : educationHistory.length > 0 ? (
                  educationHistory.map((education) => (
                    <EducationCard
                      key={education.id}
                      education={education}
                      onToggleBookmark={handleToggleBookmark}
                    />
                  ))
                ) : (
                  <div className="text-center py-16 w-full">
                    <p className="text-gray-60 text-lg">
                      스크랩한 교육 공고가 없습니다.
                    </p>
                    <p className="text-gray-50 text-sm mt-2">
                      교육 공고에서 원하는 공고를 스크랩하세요!
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center py-16 w-full">
                  <p className="text-gray-60 text-lg">탭을 선택해주세요.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function HeartListsPage() {
  return (
    <Suspense fallback={<div></div>}>
      <HeartListsContent />
    </Suspense>
  );
}
