export default function JobCardSkeleton() {
  return (
    <div className="relative rounded-3xl border-4 border-[#E1F5EC] overflow-hidden shadow-[0_10px_20px_0_rgba(17,17,17,0.15)] p-5 w-[588px] bg-white animate-pulse">
      {/* 상단 이미지 스켈레톤 */}
      <div
        className="relative flex-shrink-0 rounded-xl bg-gray-200"
        style={{
          width: '540px',
          height: '200px',
        }}
      >
        {/* Compact 오버레이 스켈레톤 */}
        <div
          className="absolute bottom-0 left-0 right-0 py-4 px-6 rounded-xl bg-gray-300"
          style={{
            borderRadius: '12px',
          }}
        >
          <div className="flex justify-between items-center">
            <div className="flex flex-row gap-3">
              <div className="h-6 w-32 bg-gray-400 rounded"></div>
              <div className="h-4 w-20 bg-gray-400 rounded"></div>
            </div>
            <div className="h-5 w-16 bg-gray-400 rounded"></div>
          </div>
        </div>
      </div>

      {/* 하단 텍스트 스켈레톤 */}
      <div className="space-y-3 pt-3">
        {/* 제목 스켈레톤 */}
        <div className="h-8 w-3/4 bg-gray-200 rounded"></div>

        {/* 태그 스켈레톤 */}
        <div className="flex flex-wrap gap-2 pt-2">
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-14 bg-gray-200 rounded-full"></div>
        </div>

        {/* 급여 정보 스켈레톤 */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-8 bg-gray-200 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* 추천도 스켈레톤 */}
        <div className="absolute bottom-5 right-5 flex flex-row items-center gap-4">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-8 w-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
