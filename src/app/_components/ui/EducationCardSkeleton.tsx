export default function EducationCardSkeleton() {
  return (
    <div className="relative rounded-2xl md:rounded-3xl border-2 md:border-4 border-[#E1F5EC] overflow-hidden cursor-pointer shadow-[0_4px_12px_0_rgba(17,17,17,0.1)] md:shadow-[0_10px_20px_0_rgba(17,17,17,0.15)] p-3 md:p-5 w-full max-w-[588px] mx-auto bg-white">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>

      {/* 상단 이미지 스켈레톤 */}
      <div className="relative flex-shrink-0 rounded-lg md:rounded-xl w-full h-[120px] md:h-[200px] bg-gray-200 animate-pulse">
        {/* Compact 오버레이 스켈레톤 */}
        <div className="absolute bottom-0 left-0 right-0 py-2 md:py-4 px-3 md:px-6 rounded-lg md:rounded-xl bg-gray-300 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="flex flex-row gap-1 md:gap-3 flex-1 min-w-0">
              <div className="h-4 md:h-6 w-24 md:w-32 bg-gray-400 rounded animate-pulse"></div>
              <div className="h-3 md:h-4 w-16 md:w-20 bg-gray-400 rounded animate-pulse"></div>
            </div>
            <div className="h-3 md:h-5 w-12 md:w-16 bg-gray-400 rounded animate-pulse flex-shrink-0"></div>
          </div>
        </div>
      </div>

      {/* 하단 텍스트 스켈레톤 */}
      <div className="space-y-2 md:space-y-3 pt-2 md:pt-3">
        {/* 제목 스켈레톤 */}
        <div className="h-5 md:h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>

        {/* 태그 스켈레톤 */}
        <div className="flex flex-wrap gap-1 md:gap-2">
          <div
            className="h-5 md:h-6 w-12 md:w-16 bg-gray-200 rounded-full animate-pulse"
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className="h-5 md:h-6 w-16 md:w-20 bg-gray-200 rounded-full animate-pulse"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="h-5 md:h-6 w-10 md:w-14 bg-gray-200 rounded-full animate-pulse"
            style={{ animationDelay: '0.3s' }}
          ></div>
        </div>

        {/* 기간 정보 스켈레톤 */}
        <div className="flex justify-between items-center pt-1 md:pt-2">
          <div className="flex items-center gap-2">
            <div
              className="h-3 md:h-4 w-6 md:w-8 bg-gray-200 rounded animate-pulse"
              style={{ animationDelay: '0.4s' }}
            ></div>
            <div
              className="h-3 md:h-4 w-16 md:w-20 bg-gray-200 rounded animate-pulse"
              style={{ animationDelay: '0.5s' }}
            ></div>
          </div>
        </div>

        {/* 추천도 스켈레톤 */}
        <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 flex flex-row items-center gap-2 md:gap-4">
          <div
            className="h-3 md:h-4 w-16 md:w-20 bg-gray-200 rounded animate-pulse"
            style={{ animationDelay: '0.6s' }}
          ></div>
          <div
            className="h-6 md:h-8 w-8 md:w-12 bg-gray-200 rounded animate-pulse"
            style={{ animationDelay: '0.7s' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
