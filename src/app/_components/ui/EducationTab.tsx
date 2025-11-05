'use client';

interface EducationTabProps {
  activeTab: 'custom' | 'all';
  onTabChange: (tab: 'custom' | 'all') => void;
  isLoggedIn?: boolean;
}

export default function EducationTab({
  activeTab,
  onTabChange,
  isLoggedIn = true,
}: EducationTabProps) {
  const handleCustomTabClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoggedIn) {
      onTabChange('custom');
    } else {
      // 비로그인 시에도 탭을 변경하여 EmptyEducations 표시
      onTabChange('custom');
    }
  };

  const handleAllTabClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTabChange('all');
  };

  return (
    <div className="flex gap-4 md:gap-8 mt-6 md:mt-10">
      <button
        onClick={handleCustomTabClick}
        className={`text-xl md:text-4xl py-2 md:py-[10px] px-4 md:px-8 relative cursor-pointer ${
          activeTab === 'custom'
            ? 'text-black'
            : isLoggedIn
              ? 'text-gray-50 hover:text-gray-70'
              : 'text-gray-50 hover:text-gray-70'
        }`}
      >
        맞춤교육
        {activeTab === 'custom' && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-[#9FC2FF]"></div>
        )}
      </button>
      <button
        onClick={handleAllTabClick}
        className={`text-xl md:text-4xl font-medium py-2 md:py-[10px] px-4 md:px-8 relative cursor-pointer ${
          activeTab === 'all' ? 'text-black' : 'text-gray-50 hover:text-gray-70'
        }`}
      >
        전체교육
        {activeTab === 'all' && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-[#9FC2FF]"></div>
        )}
      </button>
    </div>
  );
}
