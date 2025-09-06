'use client';

interface JobTabProps {
  activeTab: 'custom' | 'all';
  onTabChange: (tab: 'custom' | 'all') => void;
}

export default function JobTab({ activeTab, onTabChange }: JobTabProps) {
  return (
    <div className="flex gap-8 mt-40">
      <button
        onClick={() => onTabChange('custom')}
        className={`text-title-xlarge py-[10px] px-8 relative ${
          activeTab === 'custom' ? 'text-black' : 'text-gray-50'
        }`}
      >
        맞춤공고
        {activeTab === 'custom' && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-90"></div>
        )}
      </button>
      <button
        onClick={() => onTabChange('all')}
        className={`text-title-xlarge font-medium py-[10px] px-8 relative ${
          activeTab === 'all' ? 'text-black' : 'text-gray-50'
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
