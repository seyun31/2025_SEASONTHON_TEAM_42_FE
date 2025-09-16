'use client';

interface JobTabProps {
  activeTab: 'custom' | 'all';
  onTabChange: (tab: 'custom' | 'all') => void;
  isLoggedIn?: boolean;
}

export default function JobTab({
  activeTab,
  onTabChange,
  isLoggedIn = true,
}: JobTabProps) {
  const handleCustomTabClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('JobTab - Custom tab clicked:', { isLoggedIn });
    if (isLoggedIn) {
      onTabChange('custom');
    }
  };

  const handleAllTabClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('JobTab - All tab clicked');
    onTabChange('all');
  };

  return (
    <div className="flex gap-4 md:gap-8 mt-6 md:mt-10">
      <button
        onClick={handleCustomTabClick}
        disabled={!isLoggedIn}
        className={`text-xl md:text-4xl py-2 md:py-[10px] px-4 md:px-8 relative ${
          activeTab === 'custom'
            ? 'text-black'
            : isLoggedIn
              ? 'text-gray-50 hover:text-gray-70'
              : 'text-gray-30 cursor-not-allowed'
        }`}
      >
        맞춤공고
        {activeTab === 'custom' && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-90"></div>
        )}
      </button>
      <button
        onClick={handleAllTabClick}
        className={`text-xl md:text-4xl font-medium py-2 md:py-[10px] px-4 md:px-8 relative ${
          activeTab === 'all' ? 'text-black' : 'text-gray-50 hover:text-gray-70'
        }`}
      >
        전체공고
        {activeTab === 'all' && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-90"></div>
        )}
      </button>
    </div>
  );
}
