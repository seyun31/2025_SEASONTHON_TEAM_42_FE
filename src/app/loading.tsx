import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/assets/Icons/loading-star-2.png"
          alt="loading"
          width={296}
          height={327}
          className="mb-8 md:mb-16 w-[200px] h-auto md:w-[328px]"
        />
        <p className="text-2xl md:text-3xl font-semibold text-gray-50">
          로딩중이에요
        </p>
      </div>
    </div>
  );
}
