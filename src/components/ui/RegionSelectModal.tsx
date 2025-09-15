'use client';

import { useState } from 'react';
import Image from 'next/image';
import { REGIONS, CITIES } from '@/data/location';

type RegionType = (typeof REGIONS)[number];

interface RegionSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedAddress: string) => void;
  offsetY?: string;
}

export default function RegionSelectModal({
  isOpen,
  onClose,
  onConfirm,
  offsetY = '-33px',
}: RegionSelectModalProps) {
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

    onConfirm(selectedAddress);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ transform: `translateY(${offsetY})` }}
    >
      <div className="flex flex-col items-center justify-center gap-6">
        {/* 지역 선택 박스 */}
        <div className="relative w-[30.5vw] h-[67vh] bg-white border-4 border-primary-90 rounded-[32px] flex flex-col items-center">
          {/* 로고 이미지 */}
          <div className="absolute top-[4%] left-1/2 transform -translate-x-1/2 z-20">
            <Image
              src="/assets/logos/name-logo.svg"
              alt="nextcareer 메인 로고"
              width={0}
              height={0}
              className="w-[6.4vw] h-[4.1vh]"
            />
          </div>

          {/* 컨텐츠 영역 */}
          <div className="absolute top-[90px] left-1/2 transform -translate-x-1/2 z-10 w-[calc(30.5vw-48px)] h-[calc(64vh-180px)] rounded-[16px] border-2 border-primary-30 flex flex-col overflow-hidden bg-white">
            {/* 제목 바 */}
            <div className="h-[7.41vh] flex items-center justify-center px-4 border-b-2 border-primary-30 relative">
              <span className="text-body-large-medium">거주지 선택</span>
              <Image
                src="/assets/Icons/cross.svg"
                alt="닫기"
                width={0}
                height={0}
                className="absolute right-6 w-[1.25vw] h-[2.22vh] cursor-pointer"
                onClick={onClose}
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
                      'border-primary-30',
                      'bg-white text-body-medium-medium cursor-pointer hover:bg-primary-20/10',
                    ].join(' ')}
                    style={{ color: r === region ? undefined : '#869f8e' }}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* 우측: 도시 리스트 */}
              <div className="relative bg-white overflow-y-auto max-h-full scrollbar-hide border-l-2 border-primary-30">
                <div className="h-full">
                  {(CITIES[region] || []).map((c: string) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCity(c)}
                      className={[
                        'w-full h-[5.46vh] text-left city-indent pr-4 flex-shrink-0',
                        'border-b border-primary-30',
                        'bg-white text-body-medium-medium cursor-pointer hover:bg-primary-20/10',
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
              'absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 w-[calc(15.5vw-48px)] h-[7.5vh] rounded-[12px] text-title-medium',
              region && ((CITIES[region] || []).length === 0 || city)
                ? 'bg-primary-90 text-white'
                : 'bg-primary-30 text-title-medium cursor-not-allowed',
            ].join(' ')}
          >
            선택하기
          </button>
        </div>
      </div>
    </div>
  );
}
