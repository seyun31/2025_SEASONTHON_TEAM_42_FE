'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { REGIONS, CITIES } from '@/data/location';

type RegionType = (typeof REGIONS)[number];

export default function RegionSelectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [region, setRegion] = useState<RegionType>(REGIONS[0]);
  const [city, setCity] = useState<string>('');

  const handleConfirm = () => {
    if (!region) return;

    const cities = CITIES[region] || [];
    let selectedAddress;

    if (cities.length === 0) {
      selectedAddress = region;
    } else {
      selectedAddress = `${region} ${city}`;
    }

    // URL에 선택된 주소를 쿼리 파라미터로 전달하고 이전 페이지로 돌아가기
    router.push(
      `/member/signup?address=${encodeURIComponent(selectedAddress)}`
    );
  };

  const handleClose = () => {
    router.push('/member/signup');
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* 지역 선택 박스 */}
        <div className="relative w-[30.5vw] h-[67vh] border-4 border-primary-90 rounded-[32px] flex flex-col items-center">
          <div className="absolute inset-0 rounded-[32px] bg-primary-20 opacity-50 pointer-events-none" />

          {/* 로고 이미지 */}
          <div className="absolute top-[32px] left-1/2 transform -translate-x-1/2 z-20">
            <Image
              src="/assets/logos/name-logo.svg"
              alt="nextcareer 메인 로고"
              width={0}
              height={0}
              className="w-[6.4vw] h-[4.1vh]"
            />
          </div>

          {/* 컨텐츠 영역 */}
          <div className="absolute top-[90px] left-1/2 transform -translate-x-1/2 z-10 w-[calc(30.5vw-48px)] h-[calc(64vh-180px)] rounded-[16px] border-2 border-primary-90 flex flex-col overflow-hidden bg-white">
            {/* 제목 바 */}
            <div className="h-[7.41vh] flex items-center justify-center px-4 border-b-2 border-primary-90 relative">
              <span className="text-body-large-medium">거주지 선택</span>
              <Image
                src="/assets/Icons/cross.svg"
                alt="닫기"
                width={0}
                height={0}
                className="absolute right-6 w-[1.25vw] h-[2.22vh] cursor-pointer"
                onClick={handleClose}
              />
            </div>

            {/* 본문 */}
            <div className="grid grid-cols-[160px_1fr] flex-1 overflow-hidden">
              {/* 좌측: 시/도 리스트 */}
              <div className="overflow-y-auto max-h-full scrollbar-hide bg-white">
                {REGIONS.map((r, i) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRegion(r as RegionType);
                      setCity('');
                    }}
                    className={[
                      'w-full h-[5.46vh] text-center px-4 flex-shrink-0',
                      i === 0 ? 'border-t-0' : 'border-t',
                      'border-primary-40',
                      'bg-white text-body-medium-medium hover:bg-primary-20/10',
                    ].join(' ')}
                    style={{ color: r === region ? undefined : '#869f8e' }}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* 우측: 도시 리스트 */}
              <div className="relative bg-white overflow-y-auto max-h-full scrollbar-hide">
                <div className="absolute left-0 top-0 h-full w-[2px] bg-primary-90" />
                <div className="h-full">
                  {(CITIES[region] || []).map((c: string, i: number) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCity(c)}
                      className={[
                        'w-full h-[5.46vh] text-left city-indent pr-4 flex-shrink-0',
                        'border-b border-primary-40',
                        'bg-white text-body-medium-medium hover:bg-primary-20/10',
                      ].join(' ')}
                      style={{ color: city === c ? undefined : '#869f8e' }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 선택하기 버튼 */}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!region || ((CITIES[region] || []).length > 0 && !city)}
            className={[
              'absolute bottom-6 left-6 right-6 z-10 w-[calc(30.5vw-48px)] h-[6.67vh] rounded-[12px] border-2 border-primary-90 text-title-medium',
              region && ((CITIES[region] || []).length === 0 || city)
                ? 'bg-primary-90 text-white'
                : 'bg-primary-20 text-title-medium cursor-not-allowed',
            ].join(' ')}
          >
            선택하기
          </button>
        </div>
      </div>
    </div>
  );
}
