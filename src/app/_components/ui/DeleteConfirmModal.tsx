'use client';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#11111166] flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
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
            onClick={onConfirm}
          >
            삭제
          </button>
          <button
            type="button"
            className="px-6 py-3 bg-[#C7D6CC80] text-gray-50 rounded-[12px] font-medium text-[16px] cursor-pointer"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
