import Image from 'next/image';

interface StrengthReportCardProps {
  title: string;
  experience: string;
  keywords: string[];
  jobs: string[];
  iconType?: 'dart' | 'check' | 'memo' | 'led';
}

export default function StrengthReportCard({
  title,
  experience,
  keywords,
  jobs,
  iconType = 'dart',
}: StrengthReportCardProps) {
  const getIconSrc = () => {
    switch (iconType) {
      case 'dart':
        return '/assets/Icons/strength-dart.svg';
      case 'check':
        return '/assets/Icons/strength-check.svg';
      case 'memo':
        return '/assets/Icons/strength-memo.svg';
      case 'led':
        return '/assets/Icons/strength-led.svg';
      default:
        return '/assets/Icons/strength-dart.svg';
    }
  };
  return (
    <div
      className="w-full rounded-[32px] border-4 border-primary-20 bg-white px-2 py-4"
      style={{ boxShadow: '0px 10px 20px 0px #11111126' }}
    >
      {/* 상단 타이틀 */}
      <div className="flex items-center gap-2 mb-9 ml-2">
        <Image
          src={getIconSrc()}
          alt="상단 타이틀 이미지"
          width={0}
          height={0}
          className="w-auto h-auto"
        />
        <h2
          style={{
            color: 'black',
            fontFamily: 'Pretendard Variable',
            fontWeight: 600,
            fontSize: '24px',
            lineHeight: '140%',
            letterSpacing: '-2.5%',
          }}
        >
          {title}
        </h2>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="space-y-4 text-black">
        {/* 경험 */}
        <div className="flex items-center border-b-2 border-gray-20">
          <div className="flex items-center gap-4 w-[175px] ml-2">
            <Image
              src="/assets/Icons/strength-experience.svg"
              alt="경험 이미지"
              width={0}
              height={0}
              className="w-auto h-auto mb-2"
            />
            <p className="text-strength-label ml-1">경험</p>
          </div>
          <div className="flex-1 flex items-center pb-2">
            <p className="text-strength-content">{experience}</p>
          </div>
        </div>

        {/* 강점 키워드 */}
        <div className="flex items-center border-b-2 border-gray-20">
          <div className="flex items-center gap-4 w-[170px] ml-2">
            <Image
              src="/assets/Icons/strength-keyword.svg"
              alt="강점 키워드 이미지"
              width={0}
              height={0}
              className="w-auto h-auto mb-2"
            />
            <p className="text-strength-label text-black mb-2">강점 키워드</p>
          </div>
          <div className="flex-1 flex items-center pb-2">
            <div className="inline-flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-[100px] px-3 py-2 text-primary-90 bg-primary-20 text-strength-content mb-2 "
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 추천 직무 */}
        <div className="flex items-center text-black">
          <div className="flex items-center gap-4 w-[175px] ml-2">
            <Image
              src="/assets/Icons/strength-recommend.svg"
              alt="추천 직무 이미지"
              width={0}
              height={0}
              className="w-auto h-auto"
            />
            <p className="text-strength-label ml-2">추천 직무</p>
          </div>
          <div className="flex-1 flex items-center">
            <p className="text-strength-content">{jobs.join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
