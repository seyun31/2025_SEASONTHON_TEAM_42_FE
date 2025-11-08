'use client';

import React from 'react';

interface RestartConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  message?: React.ReactNode;
  confirmText?: string;
}

export default function RestartConfirmModal({
  onConfirm,
  onCancel,
  message = (
    <>
      <div>처음부터 다시 시작하시면</div>
      <div className="text-primary-90 font-semibold">
        이전 대화 내용을 모두 지워져요.
      </div>
      <div>다시 시작할까요?</div>
    </>
  ),
  confirmText = '다시 시작',
}: RestartConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* 모달 박스 */}
      <div className="bg-white border-4 border-gray-20 rounded-[32px] shadow-xl p-6 w-[500px] max-w-[90%] text-center">
        {/* 메시지 */}
        <div className="text-gray-800 text-[14px] md:text-[20px] leading-[150%] mb-6">
          {message}
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onConfirm}
            className="flex items-center justify-center bg-primary-90 text-[14px] md:text-[20px] text-white font-medium rounded-[12px] px-2 py-6 w-[121px] max-h-[15px] md:max-h-[40px] cursor-pointer"
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="flex items-center justify-center bg-[#C7D6CC80] text-[14px] md:text-[20px] text-gray-50 font-medium rounded-[12px] px-2 py-6 w-[80px] max-h-[15px] md:max-h-[40px] cursor-pointer"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
