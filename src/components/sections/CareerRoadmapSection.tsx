'use client';

export default function CareerRoadmapSection() {
  return (
    <section className="w-full px-4 py-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="relative bg-orange-200 rounded-2xl p-8 text-gray-80 overflow-hidden h-[420px] w-[1200px] flex-shrink-0">
          <h2 className="text-title-large mb-4">취업 로드맵</h2>
          <p className="text-body-large-regular mb-8 opacity-90">
            로그인 하시고 취업 로드맵 받아보세요!
          </p>
          <button className="bg-white text-primary-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            로그인하기
          </button>
        </div>
      </div>
    </section>
  );
}
