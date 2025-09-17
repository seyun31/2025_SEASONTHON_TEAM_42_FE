import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-hidden px-8">
      <div className="flex flex-col items-center gap-2 lg:gap-4">
        <Image
          src="/assets/logos/bad-gate-star.svg"
          alt="꿈별이 error페이지 이미지"
          width={375}
          height={316}
          className="max-w-full h-auto w-[200px] sm:w-[250px] md:w-[300px] lg:w-[375px]"
        />
        <div className="text-center">
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-50 mb-2">
            잘못된 접근입니다.
          </h1>
        </div>
      </div>
    </div>
  );
}
