'use client';

interface RoadmapHeaderProps {
  userName?: string;
  showDetailLink?: boolean;
  onDetailClick?: () => void;
}

export default function RoadmapHeader({
  userName,
  showDetailLink = false,
  onDetailClick,
}: RoadmapHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="bg-white/40 rounded-2xl px-3 py-2 flex items-center gap-3">
        <span className="text-black text-title-medium">
          {userName ? `${userName}님의 취업 로드맵` : '취업 로드맵'}
        </span>
        {showDetailLink && userName && (
          <span
            className="text-black text-body-medium-medium cursor-pointer hover:opacity-70 transition-opacity"
            onClick={onDetailClick}
          >
            자세히보기 &gt;
          </span>
        )}
      </div>
    </div>
  );
}
