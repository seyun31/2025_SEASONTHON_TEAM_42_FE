import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedExperience, setEditedExperience] = useState(experience);
  const [editedJobs, setEditedJobs] = useState(jobs.join(', '));
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const spanRef = useRef<HTMLSpanElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (spanRef.current && textareaRef.current) {
      const spanWidth = spanRef.current.offsetWidth;
      textareaRef.current.style.width = `${Math.min(spanWidth, 773)}px`;
    }
  }, [editedExperience, isEditing]);

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
        <div className="relative max-w-[1000px]">
          {/* 데스크탑 레이아웃 */}
          <div
            className="hidden md:flex md:flex-col max-w-[1000px] rounded-[32px] border-4 border-primary-20 bg-white px-2 py-4 min-h-[200px]"
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
                {!isEditing ? (
                  <>
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => setIsEditing(true)}
                    >
                      <Image
                        src="/assets/Icons/drop-edit.svg"
                        alt="수정 버튼"
                        width={0}
                        height={0}
                        className="w-auto h-auto"
                      />
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <Image
                        src="/assets/Icons/report-delete.svg"
                        alt="삭제 버튼"
                        width={0}
                        height={0}
                        className="w-auto h-auto"
                      />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="cursor-pointer w-[52px] h-[38px] px-3 py-2 bg-[#00AD381A] text-[#00AD38] rounded-[12px] font-medium text-[16px] flex items-center justify-center"
                      onClick={() => setIsEditing(false)}
                    >
                      완료
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer w-[52px] h-[38px] px-3 py-2 bg-[#C7D6CC80] text-gray-50 rounded-[12px] font-medium text-[16px] flex items-center justify-center"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      삭제
                    </button>
                  </div>
                )}
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
                  <p className="text-strength-label text-700 ml-1">
                    강점 키워드
                  </p>
                </div>
                <div className="flex-1 flex items-center pb-2 gap-3">
                  {keywords.slice(0, 3).map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-[100px] px-3 py-2 text-primary-90 bg-primary-20 text-strength-content"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* 수정가능 - 경험 */}
              <div className="flex items-start border-b-2 border-gray-20">
                <div className="flex items-center gap-4 w-[170px] ml-2">
                  <Image
                    src="/assets/Icons/strength-experience.svg"
                    alt="경험 이미지"
                    width={0}
                    height={0}
                    className="w-auto h-auto mb-2"
                  />
                  <div>
                    <p className="text-strength-label text-black mb-2">경험</p>
                  </div>
                </div>
                <div className="flex-1 flex items-start pb-2 relative">
                  {isEditing ? (
                    <>
                      <textarea
                        ref={textareaRef}
                        value={editedExperience}
                        onChange={(e) => setEditedExperience(e.target.value)}
                        className="min-w-[300px] max-w-[773px] h-[43px] py-2 px-6 border-2 border-[#71D193] rounded-[12px] text-strength-content focus:outline-none focus:border-[#71D193] resize-none overflow-x-auto whitespace-nowrap text-left"
                      />
                      <span
                        ref={spanRef}
                        className="absolute opacity-0 whitespace-nowrap text-strength-content py-2 px-6 pointer-events-none"
                      >
                        {editedExperience || ' '}
                      </span>
                    </>
                  ) : (
                    <div className="inline-flex flex-wrap gap-2">
                      <p className="text-strength-content break-words">
                        {editedExperience}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 수정 가능 - 강점 어필 */}
              <div className="flex items-start text-black mb-9">
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
                <div className="flex-1 flex items-start">
                  {isEditing ? (
                    <textarea
                      value={editedJobs}
                      onChange={(e) => setEditedJobs(e.target.value)}
                      className="w-[773px] min-h-[160px] py-2 px-6 border-2 border-[#71D193] rounded-[12px] text-strength-content scrollbar-hide focus:outline-none focus:border-[#71D193] text-left"
                    />
                  ) : (
                    <p className="text-strength-content break-words">
                      {editedJobs}
                    </p>
                  )}
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
                {!isEditing ? (
                  <>
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => setIsEditing(true)}
                    >
                      <Image
                        src="/assets/Icons/drop-edit.svg"
                        alt="수정 버튼"
                        width={0}
                        height={0}
                        className="w-auto h-auto"
                      />
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <Image
                        src="/assets/Icons/report-delete.svg"
                        alt="삭제 버튼"
                        width={0}
                        height={0}
                        className="w-auto h-auto"
                      />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="cursor-pointer w-[52px] h-[38px] px-3 py-2 bg-[#00AD381A] text-[#00AD38] rounded-[12px] font-medium text-[14px] flex items-center justify-center"
                      onClick={() => setIsEditing(false)}
                    >
                      완료
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer w-[52px] h-[38px] px-3 py-2 bg-[#C7D6CC80] text-gray-50 rounded-[12px] font-medium text-[14px] flex items-center justify-center"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 콘텐츠 영역 - 스크롤 가능 */}
            <div className="space-y-3 text-black overflow-y-auto scrollbar-hide flex-1">
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
                  <p className="text-strength-label-mobile">강점 키워드</p>
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
                  <p className="text-strength-label-mobile text-black">경험</p>
                </div>
                {isEditing ? (
                  <textarea
                    value={editedExperience}
                    onChange={(e) => setEditedExperience(e.target.value)}
                    className="w-full p-2 border-2 border-primary-50 rounded-lg text-strength-content-mobile resize-none focus:outline-none focus:border-primary-70"
                    rows={3}
                  />
                ) : (
                  <p className="text-strength-content-mobile ml-10.5 break-words">
                    {editedExperience}
                  </p>
                )}
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
                {isEditing ? (
                  <textarea
                    value={editedJobs}
                    onChange={(e) => setEditedJobs(e.target.value)}
                    className="w-full p-2 border-2 border-primary-50 rounded-lg text-strength-content-mobile resize-none focus:outline-none focus:border-primary-70"
                    rows={3}
                  />
                ) : (
                  <p className="text-strength-content-mobile ml-9 break-words">
                    {editedJobs}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 삭제 확인 모달 */}
          {showDeleteModal && (
            <div className="absolute inset-0 bg-[#11111166] flex items-center justify-center z-50 md:rounded-[32px] rounded-[16px] overflow-hidden">
              <div
                className="bg-white border-4 border-[#C7D6CC] flex flex-col justify-center items-center"
                style={{
                  width: '480px',
                  height: '200px',
                  borderRadius: '32px',
                  boxShadow: '0px 10px 20px 0px #11111126',
                }}
              >
                <p className="text-center text-black font-pretendard font-medium text-[18px] leading-[150%] mb-6 whitespace-pre-line">
                  삭제하게 되면 다시 불러올 수 없어요.{'\n'}삭제할까요?
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    className="px-6 py-3 bg-[#FF4D4D] text-white rounded-[12px] font-medium text-[16px] cursor-pointer"
                    onClick={() => {
                      // 실제 삭제 로직 추가
                      setShowDeleteModal(false);
                    }}
                  >
                    삭제
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 bg-[#C7D6CC80] text-gray-50 rounded-[12px] font-medium text-[16px] cursor-pointer"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
