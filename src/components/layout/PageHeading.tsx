'use client';

import Image from 'next/image';

type Props = {
  title: string;
  right?: React.ReactNode;
  showMore?: boolean;
  onMoreClick?: () => void;
  className?: string;
};

export default function PageHeading({
  title,
  right,
  showMore,
  onMoreClick,
  className,
}: Props) {
  const rightContent =
    right ||
    (showMore && (
      <button
        onClick={onMoreClick}
        className="flex items-center gap-2 text-body-medium-medium text-gray-70"
      >
        더보기
        <Image
          src="/assets/Icons/arrow-right-gray.svg"
          alt="더보기 오른쪽 화살표"
          width={0}
          height={0}
          className="w-[1.25vw] h-[2.22vh]"
        />
      </button>
    ));

  return (
    <header
      className={[
        'flex items-center justify-between overflow-hidden w-full lg:w-[70%] h-[5.19vh] relative',
        className,
      ].join(' ')}
    >
      <div>
        <h1 className="text-title-xlarge">{title}</h1>
      </div>
      {rightContent ? <div>{rightContent}</div> : null}
    </header>
  );
}
