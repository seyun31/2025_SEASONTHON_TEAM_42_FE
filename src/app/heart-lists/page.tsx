import Footer from '@/components/layout/Footer';

export default function HeartListsPage() {
  return (
    <div className="w-full h-screen">
      <div className="max-w-[1200px] mx-auto">
        {/* 타이틀 */}
        <h2 className="hidden md:block text-title-xlarge text-black text-left mb-18">
          관심 목록
        </h2>

        {/* 데스크탑 탭 영역 */}
        <div className="hidden lg:flex gap-6 mb-6">
          <div className="border-b-3 border-primary-90 px-4 py-2">
            <button className="pb-2 text-title-xlarge text-black text-left">
              채용 공고
            </button>
          </div>
          <div className="px-4 py-2">
            <button className="pb-2 text-title-xlarge text-gray-50 text-left hover:text-black">
              교육 공고
            </button>
          </div>
        </div>

        {/* 모바일 탭 영역 */}
        <div className="flex gap-6 mb-6 mt-6 lg:hidden">
          <div className="border-b-3 border-primary-90 px-4 py-2">
            <button className="pb-2 text-xl text-black text-left">
              채용 공고
            </button>
          </div>
          <div className="px-4 py-2">
            <button className="pb-2 text-xl text-gray-50 text-left hover:text-black">
              교육 공고
            </button>
          </div>
        </div>

        {/* 관심 목록 콘텐츠 영역 */}
        <div className="h-screen flex gap-4 justify-center flex-wrap">
          {/* 카드 컴포넌트들 */}
          <div className="text-center py-16 w-full h-screen">
            <p className="text-gray-60 text-lg">아직 관심 목록이 없습니다.</p>
            <p className="text-gray-50 text-sm mt-2">
              채용 공고와 교육 공고에서 원하는 공고를 스크랩하세요!
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
