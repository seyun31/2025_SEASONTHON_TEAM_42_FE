'use client';

import React from 'react';

interface ReJobCardModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ReJobCardModal({
  onConfirm,
  onCancel,
}: ReJobCardModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* 모달 박스 */}
      <div className="bg-white border-4 border-gray-20 rounded-[32px] shadow-xl p-6 w-[500px] max-w-[90%] text-center">
        {/* 메시지 */}
        <p className="text-gray-800 text-[14px] md:text-[20px] leading-[150%] mb-6">
          새로운 직업카드를 생성하면{' '}
          <span className="text-primary-90 font-semibold">
            이전 직업카드는 사라져요.
          </span>
          <br />
          마음에 드는게 있다면 미리 북마크 해두세요!
        </p>

        {/* 버튼 영역 */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onConfirm}
            className="flex items-center justify-center bg-primary-90 text-[14px] md:text-[20px] text-white font-medium rounded-[12px] px-2 py-6 max-h-[15px] md:max-h-[40px] cursor-pointer"
          >
            재생성
          </button>
          <button
            onClick={onCancel}
            className="flex items-center justify-center bg-[#C7D6CC80] text-[14px] md:text-[20px] text-gray-50 font-medium rounded-[12px] px-2 py-6 max-h-[15px] md:max-h-[40px] cursor-pointer"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
