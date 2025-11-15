import React from 'react';

interface StrengthReportCard {
  title: string;
  experience: string;
  keywords: string[];
  jobs: string[];
  iconType?: 'dart' | 'check' | 'memo' | 'led';
}

interface PrintableStrengthReportProps {
  cards: StrengthReportCard[];
  userName: string;
}

function getIconEmoji(iconType: string = 'dart'): string {
  switch (iconType) {
    case 'dart':
      return '🎯';
    case 'check':
      return '✅';
    case 'memo':
      return '📝';
    case 'led':
      return '💡';
    default:
      return '🎯';
  }
}

const PrintableStrengthReport = React.forwardRef<
  HTMLDivElement,
  PrintableStrengthReportProps
>(({ cards, userName }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white"
      style={{ width: '794px', padding: '40px' }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
          {userName}님의 <span style={{ color: '#00AD38' }}>강점 리포트</span>
        </h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/logos/name-logo.svg"
          alt="로고"
          width={76}
          height={36}
          crossOrigin="anonymous"
          style={{ flexShrink: 0, marginRight: '12px', marginTop: '18px' }}
        />
      </div>

      {/* 카드들 */}
      {cards.map((card, index) => (
        <div
          key={index}
          data-card-id={card.title}
          className="avoid-break border-2 border-[#C7D6CC] rounded-3xl p-6 mb-6 bg-white"
        >
          {/* 카드 헤더 */}
          <div className="flex items-center mb-5">
            <span className="text-3xl mr-3 mb-3">
              {getIconEmoji(card.iconType)}
            </span>
            <h2 className="text-xl font-semibold">{card.title}</h2>
          </div>

          {/* 강점 키워드 */}
          <div className="flex items-start mb-4">
            <div className="flex items-center min-w-[130px]">
              <span className="text-lg mr-4">🔖</span>
              <span className="font-medium">강점 키워드</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {card.keywords.slice(0, 3).map((keyword, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: '#E6F7EC',
                    color: '#00AD38',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: '0 12px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: '8px',
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* 경험 */}
          <div className="flex items-start mb-4">
            <div className="flex items-center min-w-[130px]">
              <span className="text-lg mr-4">🎖️</span>
              <span className="font-medium">경험</span>
            </div>
            <p className="flex-1 text-sm leading-relaxed mt-1">
              {card.experience}
            </p>
          </div>

          {/* 강점 어필 */}
          <div className="flex items-start">
            <div className="flex items-center min-w-[130px]">
              <span className="text-lg mr-4">👔</span>
              <span className="font-medium">강점 어필</span>
            </div>
            <p className="flex-1 text-sm leading-relaxed">
              {card.jobs.join(', ')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
});

PrintableStrengthReport.displayName = 'PrintableStrengthReport';

export default PrintableStrengthReport;
