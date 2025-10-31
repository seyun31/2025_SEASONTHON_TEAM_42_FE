import Image from 'next/image';
import Link from 'next/link';

interface EmptyRecommendationsProps {
  userName?: string;
}

export default function EmptyRecommendations({
  userName,
}: EmptyRecommendationsProps) {
  return (
    <section className="w-full px-4 py-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-4xl font-semibold text-gray-80 text-left items-center">
            {userName ? (
              <>
                {userName}님을 위한 <br className="md:hidden" /> 오늘의 맞춤
                일자리 추천
              </>
            ) : (
              '오늘의 일자리 추천'
            )}
          </h2>
          <a
            href="/job-postings"
            className="text-primary-300 hover:text-primary-600 transition-colors"
          >
            더보기
          </a>
        </div>

        {/* 빈 상태 컨텐츠 */}
        <div className="flex flex-col items-center justify-center py-16 md:py-24">
          <div className="mb-8">
            <Image
              src="/assets/logos/bad-gate-star.svg"
              alt="추천 공고 없음"
              width={120}
              height={120}
              className="w-24 h-24 md:w-32 md:h-32"
            />
          </div>

          <div className="text-center space-y-4">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-80">
              아직 추천할 공고가 없어요
            </h3>
            <p className="text-base md:text-lg text-gray-60 max-w-md">
              로드맵을 생성해서 맞춤형 공고를 추천받아보세요
            </p>

            <div className="pt-4">
              <Link
                href="/ai-chat/roadmap"
                className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-primary-90 text-white text-base md:text-lg font-medium rounded-xl md:rounded-2xl hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                로드맵 생성하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
