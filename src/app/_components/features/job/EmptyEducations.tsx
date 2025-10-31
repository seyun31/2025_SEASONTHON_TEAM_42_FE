import Image from 'next/image';
import Link from 'next/link';

interface EmptyEducationsProps {
  isLoggedIn: boolean;
  activeTab: 'custom' | 'all';
}

export default function EmptyEducations({
  isLoggedIn,
  activeTab,
}: EmptyEducationsProps) {
  const getTitle = () => {
    if (isLoggedIn && activeTab === 'custom') {
      return '아직 추천할 교육과정이 없어요';
    }
    return '검색 결과가 없어요';
  };

  const getMessage = () => {
    if (isLoggedIn && activeTab === 'custom') {
      return '로드맵을 생성해서 맞춤형 교육과정을 추천받아보세요';
    }
    return '다른 검색어나 필터를 시도해보세요';
  };

  const getButtonText = () => {
    if (isLoggedIn && activeTab === 'custom') {
      return '로드맵 생성하기';
    }
    return '전체 교육과정 보기';
  };

  const getButtonLink = () => {
    if (isLoggedIn && activeTab === 'custom') {
      return '/ai-chat/roadmap';
    }
    return '/education-programs?tab=all';
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24">
      <div className="mb-8">
        <Image
          src="/assets/logos/bad-gate-star.svg"
          alt="교육과정 없음"
          width={120}
          height={120}
          className="w-24 h-24 md:w-32 md:h-32"
        />
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-80">
          {getTitle()}
        </h3>
        <p className="text-base md:text-lg text-gray-60 max-w-md">
          {getMessage()}
        </p>

        <div className="pt-4">
          <Link
            href={getButtonLink()}
            className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-primary-90 text-white text-base md:text-lg font-medium rounded-xl md:rounded-2xl hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {getButtonText()}
          </Link>
        </div>
      </div>
    </div>
  );
}
