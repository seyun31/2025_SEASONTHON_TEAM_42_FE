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
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl">
        {/* 텍스트 메시지 */}
        <div className="text-center mb-6">
          <p className="text-black text-base mb-2">
            삭제하게 되면 다시 불러올 수 없어요.
          </p>
          <p className="text-black text-base">삭제할까요?</p>
        </div>

        {/* 버튼들 */}
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl text-base font-medium transition-colors"
          >
            삭제
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-base font-medium transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
