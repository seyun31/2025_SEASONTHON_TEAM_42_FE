'use client';

interface RoadmapHeaderProps {
  userName?: string;
  showDetailLink?: boolean;
  onDetailClick?: () => void;
  multiLine?: boolean;
}

export default function RoadmapHeader({
  userName,
  showDetailLink = false,
  onDetailClick,
  multiLine = false,
}: RoadmapHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="bg-white/40 rounded-2xl px-3 py-2 flex items-start gap-3 flex-col">
        <span
          className="text-black font-semibold"
          style={{
            fontSize: '24px',
            lineHeight: '140%',
            letterSpacing: '-2.5%',
          }}
        >
          {userName ? (
            multiLine ? (
              <>
                {userName}님의
                <br />
                커리어 로드맵
              </>
            ) : (
              `${userName}님의  커리어 로드맵`
            )
          ) : (
            ' 커리어 로드맵'
          )}
        </span>
        {showDetailLink && userName && (
          <span
            className="text-black font-normal cursor-pointer hover:opacity-70 transition-opacity"
            style={{
              fontSize: '18px',
              lineHeight: '150%',
              letterSpacing: '-2.5%',
            }}
            onClick={onDetailClick}
          >
            자세히보기 &gt;
          </span>
        )}
      </div>
    </div>
  );
}
