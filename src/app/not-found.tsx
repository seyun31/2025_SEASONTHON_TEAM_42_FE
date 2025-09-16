import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/assets/logos/bad-gate-star.svg"
          alt="꿈별이 error페이지 이미지"
          width={375}
          height={316}
          className="max-w-full h-auto"
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-50 mb-2">
            조건에 맞는 정보가 없습니다.
          </h1>
        </div>
      </div>
    </div>
  );
}
