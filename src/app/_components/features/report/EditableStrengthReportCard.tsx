import Image from 'next/image';
import React from 'react';
import { ArrowDownToLine } from 'lucide-react';

interface StrengthReportCardProps {
  title: string;
  experience: string;
  keywords: string[];
  jobs: string[];
  iconType?: 'dart' | 'check' | 'memo' | 'led';
}

export default function StrengthReportCard({
  title,
  experience,
  keywords,
  jobs,
  iconType = 'dart',
}: StrengthReportCardProps) {
  const getIconSrc = () => {
    switch (iconType) {
      case 'dart':
        return '/assets/Icons/strength-dart.svg';
      case 'check':
        return '/assets/Icons/strength-check.svg';
      case 'memo':
        return '/assets/Icons/strength-memo.svg';
      case 'led':
        return '/assets/Icons/strength-led.svg';
      default:
        return '/assets/Icons/strength-dart.svg';
    }
  };
  return (
    <>
      <div>
        {/* PDF 다운로드 버튼 */}
        <div className="flex justify-end cursor-pointer mb-3 max-w-[1000px]">
          <button className="text-gray-70 flex items-center gap-3 cursor-pointer">
            <span className="font-pretendard font-medium text-[20px] leading-[150%] tracking-[-0.025em]">
              PDF 다운로드
            </span>
            <ArrowDownToLine className="w-6 h-6 text-gray-70" />
          </button>
        </div>
        {/* 데스크탑 레이아웃 */}
        <div
          className="hidden md:flex md:flex-col max-w-[1000px] rounded-[32px] border-4 border-primary-20 bg-white px-2 py-4 h-full"
          style={{ boxShadow: '0px 4px 8px 0px #11111120' }}
        >
          {/* 상단 타이틀 */}
          <div className="flex items-center gap-2 mb-9 ml-2 flex-shrink-0">
            <Image
              src={getIconSrc()}
              alt="상단 타이틀 이미지"
              width={0}
              height={0}
              className="w-auto h-auto"
            />
            <h2
              style={{
                color: 'black',
                fontFamily: 'Pretendard Variable',
                fontWeight: 600,
                fontSize: '24px',
                lineHeight: '140%',
                letterSpacing: '-2.5%',
              }}
            >
              {title}
            </h2>
            {/* 수정 및 삭제 버튼 */}
            <div className="ml-auto flex items-center gap-6 mr-6">
              <button type="button" className="cursor-pointer">
                <Image
                  src="/assets/Icons/drop-edit.svg"
                  alt="수정 버튼"
                  width={0}
                  height={0}
                  className="w-auto h-auto"
                />
              </button>
              <button type="button" className="cursor-pointer">
                <Image
                  src="/assets/Icons/report-delete.svg"
                  alt="삭제 버튼"
                  width={0}
                  height={0}
                  className="w-auto h-auto"
                />
              </button>
            </div>
          </div>

          {/* 콘텐츠 영역 - 스크롤 가능 */}
          <div className="space-y-4 text-black overflow-y-auto scrollbar-hide flex-1">
            {/* 강점 키워드 */}
            <div className="flex items-center border-b-2 border-gray-20">
              <div className="flex items-center gap-4 w-[175px] ml-2">
                <Image
                  src="/assets/Icons/strength-keyword.svg"
                  alt="강점 키워드 이미지"
                  width={0}
                  height={0}
                  className="w-auto h-auto mb-2"
                />
                <p className="text-strength-label text-700 ml-1">강점 키워드</p>
              </div>
              <div className="flex-1 flex items-center pb-2 gap-3">
                {keywords.slice(0, 3).map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-[100px] px-3 py-2 text-primary-90 bg-primary-20 text-strength-content mb-2"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* 경험 */}
            <div className="flex items-center border-b-2 border-gray-20">
              <div className="flex items-center gap-4 w-[170px] ml-2">
                <Image
                  src="/assets/Icons/strength-experience.svg"
                  alt="경험 이미지"
                  width={0}
                  height={0}
                  className="w-auto h-auto mb-2"
                />
                <p className="text-strength-label text-black mb-2">경험</p>
              </div>
              <div className="flex-1 flex items-center pb-2">
                <div className="inline-flex flex-wrap gap-2">
                  <p className="text-strength-content break-words">
                    {experience}
                  </p>
                </div>
              </div>
            </div>

            {/* 강점 어필 */}
            <div className="flex items-center text-black pb-4">
              <div className="flex items-center gap-4 w-[175px] ml-2">
                <Image
                  src="/assets/Icons/strength-recommend.svg"
                  alt="강점 어필 이미지"
                  width={0}
                  height={0}
                  className="w-auto h-auto"
                />
                <p className="text-strength-label ml-2">강점 어필</p>
              </div>
              <div className="flex-1 flex items-center">
                <p className="text-strength-content break-words">
                  {jobs.join(', ')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 모바일 레이아웃 */}
        <div
          className="block md:hidden w-full h-[380px] rounded-[16px] border-2 border-primary-20 bg-white px-3 py-4 flex flex-col"
          style={{ boxShadow: '0px 4px 8px 0px #11111120' }}
        >
          {/* 상단 타이틀 */}
          <div className="flex items-center gap-3 mb-7 flex-shrink-0">
            <Image
              src={getIconSrc()}
              alt="상단 타이틀 이미지"
              width={0}
              height={0}
              className="w-auto h-auto"
            />
            <h2
              style={{
                color: 'black',
                fontFamily: 'Pretendard Variable',
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '140%',
                letterSpacing: '-2.5%',
              }}
            >
              {title}
            </h2>
            <div className="ml-auto flex items-center gap-2">
              <button type="button" className="cursor-pointer">
                <Image
                  src="/assets/Icons/drop-edit.svg"
                  alt="수정 버튼"
                  width={0}
                  height={0}
                  className="w-auto h-auto"
                />
              </button>
              <button type="button" className="cursor-pointer">
                <Image
                  src="/assets/Icons/report-delete.svg"
                  alt="삭제 버튼"
                  width={0}
                  height={0}
                  className="w-auto h-auto"
                />
              </button>
            </div>
          </div>

          {/* 콘텐츠 영역 - 스크롤 가능 */}
          <div className="space-y-3 text-black overflow-y-auto scrollbar-hide flex-1">
            {/* 경험 */}
            <div className="border-b-2 border-gray-20 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Image
                  src="/assets/Icons/strength-experience.svg"
                  alt="경험 이미지"
                  width={0}
                  height={0}
                  className="w-auto h-auto"
                />
                <p className="text-strength-label-mobile">경험</p>
              </div>
              <p className="text-strength-content-mobile ml-10.5 break-words">
                {experience}
              </p>
            </div>

            {/* 강점 키워드 */}
            <div className="border-b-2 border-gray-20 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Image
                  src="/assets/Icons/strength-keyword.svg"
                  alt="강점 키워드 이미지"
                  width={0}
                  height={0}
                  className="w-auto h-auto"
                />
                <p className="text-strength-label-mobile text-black">
                  강점 키워드
                </p>
              </div>
              <div className="flex flex-wrap gap-2 ml-10">
                {keywords.slice(0, 3).map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-[100px] px-3 py-1 text-primary-90 bg-primary-20 text-strength-content-mobile"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* 추천 직무 */}
            <div className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Image
                  src="/assets/Icons/strength-recommend.svg"
                  alt="추천 직무 이미지"
                  width={0}
                  height={0}
                  className="w-auto h-auto"
                />
                <p className="text-strength-label-mobile">추천 직무</p>
              </div>
              <p className="text-strength-content-mobile ml-9 break-words">
                {jobs.join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
