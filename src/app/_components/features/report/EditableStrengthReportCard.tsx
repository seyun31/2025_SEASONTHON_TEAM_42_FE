import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import {
  deleteStrengthReport,
  updateStrengthReport,
} from '@/lib/api/reportApi';

interface StrengthReportCardProps {
  strengthReportId: number;
  title: string;
  experience: string;
  keywords: string[];
  jobs: string[];
  iconType?: 'dart' | 'check' | 'memo' | 'led';
  isSelected?: boolean;
  onSelect?: () => void;
  showSelectionIcon?: boolean;
  onDelete?: () => void;
  onUpdate?: () => void;
}

export default function StrengthReportCard({
  strengthReportId,
  title,
  experience,
  keywords,
  jobs,
  iconType = 'dart',
  isSelected = false,
  onSelect,
  showSelectionIcon = false,
  onDelete,
  onUpdate,
}: StrengthReportCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExperience, setEditedExperience] = useState(experience);
  const [editedJobs, setEditedJobs] = useState(jobs.join(', '));
  const [editedKeywords, setEditedKeywords] = useState<string[]>([...keywords]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const spanRef = useRef<HTMLSpanElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteStrengthReport(strengthReportId);
      setShowDeleteModal(false);
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Failed to delete strength report:', error);
      alert('강점 리포트 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...editedKeywords];
    newKeywords[index] = value;
    setEditedKeywords(newKeywords);
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      // 빈 키워드 제거
      const filteredKeywords = editedKeywords
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      if (filteredKeywords.length === 0) {
        alert('최소 1개 이상의 키워드를 입력해주세요.');
        setIsUpdating(false);
        return;
      }

      await updateStrengthReport(strengthReportId, {
        strength: title,
        experience: editedExperience,
        keyword: filteredKeywords,
        appeal: editedJobs,
      });
      setIsEditing(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to update strength report:', error);
      alert('강점 리포트 수정에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

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
      <div className="report-card" data-report-id={strengthReportId}>
        <div className="relative max-w-[1000px]">
          {/* 선택 아이콘 - 데스크탑 */}
          {showSelectionIcon && (
            <button
              onClick={onSelect}
              className="absolute z-10 cursor-pointer hidden md:block"
              style={{ top: '-20px', left: '-20px' }}
            >
              <Image
                src={
                  isSelected
                    ? '/assets/Icons/report-check.svg'
                    : '/assets/Icons/report-normal.svg'
                }
                alt={isSelected ? '선택됨' : '선택 안됨'}
                width={56}
                height={56}
                className="w-14 h-14"
              />
            </button>
          )}
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
                      onClick={handleUpdate}
                      disabled={isUpdating}
                    >
                      완료
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer w-[52px] h-[38px] px-3 py-2 bg-[#C7D6CC80] text-gray-50 rounded-[12px] font-medium text-[16px] flex items-center justify-center"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedExperience(experience);
                        setEditedJobs(jobs.join(', '));
                        setEditedKeywords([...keywords]);
                      }}
                    >
                      취소
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 콘텐츠 영역 - 스크롤 가능 */}
            <div className="space-y-4 text-black overflow-y-auto scrollbar-hide flex-1">
              {/* 강점 키워드 */}
              <div className="flex items-start border-b-2 border-gray-20">
                <div className="flex items-center gap-4 w-[175px] ml-2">
                  <Image
                    src="/assets/Icons/strength-keyword.svg"
                    alt="강점 키워드 이미지"
                    width={0}
                    height={0}
                    className="w-auto h-auto mb-2 ml-2"
                  />
                  <p className="text-strength-label font-medium">강점 키워드</p>
                </div>
                <div className="flex-1 flex flex-col items-start pb-2 ml-4 gap-2">
                  {isEditing ? (
                    <>
                      <div className="flex gap-2 w-full">
                        {editedKeywords.map((keyword, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={keyword}
                              onChange={(e) =>
                                handleKeywordChange(index, e.target.value)
                              }
                              placeholder={`키워드 ${index + 1}`}
                              className="flex-1 min-w-[20px] h-[43px] py-2 px-3 border-2 border-[#71D193] rounded-[12px] text-strength-content focus:outline-none focus:border-[#71D193]"
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex gap-3 flex-wrap">
                      {keywords.slice(0, 3).map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-[100px] px-3 py-2 text-primary-90 bg-primary-20 text-strength-content font-medium"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 수정가능 - 경험 */}
              <div className="flex items-start border-b-2 border-gray-20">
                <div className="flex items-center gap-4 w-[170px] ml-3">
                  <Image
                    src="/assets/Icons/strength-experience.svg"
                    alt="경험 이미지"
                    width={0}
                    height={0}
                    className="w-auto h-auto mb-2"
                  />
                  <div>
                    <p className="text-strength-label text-black font-medium mb-2">
                      경험
                    </p>
                  </div>
                </div>
                <div className="flex-1 flex items-start pb-2 ml-4 relative">
                  {isEditing ? (
                    <>
                      <textarea
                        ref={textareaRef}
                        value={editedExperience}
                        onChange={(e) => setEditedExperience(e.target.value)}
                        className="min-w-[300px] max-w-[773px] h-[43px] py-2 px-2 border-2 border-[#71D193] rounded-[12px] text-strength-content focus:outline-none focus:border-[#71D193] resize-none overflow-x-auto whitespace-nowrap text-left"
                      />
                      <span
                        ref={spanRef}
                        className="absolute opacity-0 whitespace-nowrap text-strength-content py-2 px-2 pointer-events-none"
                      >
                        {editedExperience || ' '}
                      </span>
                    </>
                  ) : (
                    <div className="inline-flex flex-wrap gap-2">
                      <p className="text-strength-content font-medium break-words">
                        {editedExperience}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 수정 가능 - 강점 어필 */}
              <div className="flex items-start text-black mb-9">
                <div className="flex items-center gap-4 w-[175px] ml-3">
                  <Image
                    src="/assets/Icons/strength-recommend.svg"
                    alt="강점 어필 이미지"
                    width={0}
                    height={0}
                    className="w-auto h-auto ml-1"
                  />
                  <p className="text-strength-label font-medium ml-1">
                    강점 어필
                  </p>
                </div>
                <div className="flex-1 flex items-start ml-2">
                  {isEditing ? (
                    <textarea
                      value={editedJobs}
                      onChange={(e) => setEditedJobs(e.target.value)}
                      className="w-full max-w-[773px] min-h-[160px] py-2 px-2 border-2 border-[#71D193] rounded-[12px] text-strength-content scrollbar-hide focus:outline-none focus:border-[#71D193] text-left"
                    />
                  ) : (
                    <p className="text-strength-content font-normal break-words">
                      {editedJobs}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 선택 아이콘 - 모바일 */}
          {showSelectionIcon && (
            <button
              onClick={onSelect}
              className="absolute z-10 cursor-pointer block md:hidden"
              style={{ top: '-12px', left: '-12px' }}
            >
              <Image
                src={
                  isSelected
                    ? '/assets/Icons/report-check.svg'
                    : '/assets/Icons/report-normal.svg'
                }
                alt={isSelected ? '선택됨' : '선택 안됨'}
                width={44}
                height={44}
                className="w-11 h-11"
              />
            </button>
          )}
          {/* 모바일 레이아웃 */}
          <div
            className="block md:hidden w-full h-full rounded-[16px] border-2 border-gray-20 bg-white px-3 py-4 flex flex-col"
            style={{ boxShadow: '0px 4px 8px 0px #11111120' }}
          >
            {/* 수정/삭제 버튼 */}
            <div className="flex justify-end items-center gap-2 mb-3 flex-shrink-0">
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
                    onClick={handleUpdate}
                    disabled={isUpdating}
                  >
                    완료
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer w-[52px] h-[38px] px-3 py-2 bg-[#C7D6CC80] text-gray-50 rounded-[12px] font-medium text-[14px] flex items-center justify-center"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedExperience(experience);
                      setEditedJobs(jobs.join(', '));
                      setEditedKeywords([...keywords]);
                    }}
                  >
                    취소
                  </button>
                </div>
              )}
            </div>

            {/* 타이틀 */}
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
                  fontWeight: 600,
                  fontSize: '20px',
                  lineHeight: '140%',
                  letterSpacing: '-2.5%',
                }}
              >
                {title}
              </h2>
            </div>

            {/* 콘텐츠 영역 - 스크롤 가능 */}
            <div className="space-y-3 text-black overflow-y-auto scrollbar-hide flex-1">
              {/* 강점 키워드 */}
              <div className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src="/assets/Icons/strength-keyword.svg"
                    alt="강점 키워드 이미지"
                    width={0}
                    height={0}
                    className="w-auto h-auto ml-1"
                  />
                  <p className="text-strength-label-mobile font-medium ml-2">
                    강점 키워드
                  </p>
                </div>
                {isEditing ? (
                  <>
                    <div className="flex gap-2 w-full">
                      {editedKeywords.map((keyword, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={keyword}
                            onChange={(e) =>
                              handleKeywordChange(index, e.target.value)
                            }
                            className="flex-1 w-[10%] h-[36px] py-2 px-3 border-2 border-[#71D193] rounded-[12px] text-strength-content-mobile focus:outline-none focus:border-[#71D193]"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {keywords.slice(0, 3).map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-[100px] px-3 py-1 text-primary-90 bg-primary-20 text-strength-content-mobile font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 경험 */}
              <div className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src="/assets/Icons/strength-experience.svg"
                    alt="경험 이미지"
                    width={0}
                    height={0}
                    className="w-auto h-auto"
                  />
                  <p className="text-strength-label-mobile text-black font-medium ml-3">
                    경험
                  </p>
                </div>
                {isEditing ? (
                  <textarea
                    value={editedExperience}
                    onChange={(e) => setEditedExperience(e.target.value)}
                    className="w-[50%] h-[43px] py-2 px-6 border-2 border-[#71D193] rounded-[12px] text-strength-content-mobile focus:outline-none focus:border-[#71D193] resize-none overflow-x-auto whitespace-nowrap text-left"
                  />
                ) : (
                  <p className="text-strength-content-mobile font-medium break-words mt-3 ml-2">
                    {editedExperience}
                  </p>
                )}
              </div>

              {/* 강점 어필 */}
              <div className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src="/assets/Icons/strength-recommend.svg"
                    alt="강점 어필 이미지"
                    width={0}
                    height={0}
                    className="w-auto h-auto ml-1"
                  />
                  <p className="text-strength-label-mobile font-medium ml-3">
                    강점 어필
                  </p>
                </div>
                {isEditing ? (
                  <textarea
                    value={editedJobs}
                    onChange={(e) => setEditedJobs(e.target.value)}
                    className="w-full min-h-[160px] py-2 px-6 border-2 border-[#71D193] rounded-[12px] text-strength-content-mobile scrollbar-hide focus:outline-none focus:border-[#71D193] text-left"
                  />
                ) : (
                  <p
                    className="text-strength-content-mobile font-normal font-regular break-words mt-2"
                    style={{ fontWeight: 400 }}
                  >
                    {editedJobs}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 삭제 확인 모달 */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-[#11111166] flex items-center justify-center z-50">
              <div
                className="bg-white border-4 border-[#C7D6CC] flex flex-col justify-center items-center mx-4"
                style={{
                  maxWidth: '480px',
                  width: '100%',
                  height: '200px',
                  borderRadius: '32px',
                  boxShadow: '0px 10px 20px 0px #11111126',
                }}
              >
                <p className="text-center text-black font-pretendard font-medium text-[18px] leading-[150%] mb-6 whitespace-pre-line px-4">
                  삭제하게 되면 다시 불러올 수 없어요.{'\n'}삭제할까요?
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    className="px-6 py-3 bg-[#FF4D4D] text-white rounded-[12px] font-medium text-[16px] cursor-pointer"
                    onClick={handleDelete}
                    disabled={isDeleting}
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
