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
      className="fixed inset-0 flex items-center justify-center z-50 bg-white opacity-100"
      style={{ transform: `translateY(${offsetY})` }}
    >
      {/* 데스크톱 레이아웃 */}
      <div className="flex flex-col items-center justify-center gap-6">
        {/* 지역 선택 박스 */}
        <div className="hidden lg:block relative w-[30.5vw] h-[67vh] bg-white border-4 border-primary-90 rounded-[32px] flex flex-col items-center">
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

      {/* 모바일 레이아웃 */}
      <div className="flex lg:hidden w-full h-full flex-col items-center justify-center p-4">
        {/* 로고 이미지 */}
        <div className="mt-19 mb-19">
          <Image
            src="/assets/logos/name-logo.svg"
            alt="nextcareer 메인 로고"
            width={0}
            height={0}
            className="w-23.25 h-auto"
          />
        </div>

        {/* 지역 선택 박스 */}
        <div
          className="w-full max-w-md md:max-w-lg bg-white border-2 border-primary-30 rounded-[12px] flex flex-col overflow-hidden mb-26"
          style={{ height: 'calc(100vh - 400px)' }}
        >
          {/* 제목 바 */}
          <div className="h-16 flex items-center justify-center px-4 border-b-2 border-primary-30 relative">
            <span className="text-body-large-medium">거주지 선택</span>
            <Image
              src="/assets/Icons/cross.svg"
              alt="닫기"
              width={0}
              height={0}
              className="absolute right-4 w-6 h-6 cursor-pointer"
              onClick={onClose}
            />
          </div>

          {/* 본문 */}
          <div className="grid grid-cols-[120px_1fr] flex-1 overflow-hidden">
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
                    'w-full h-12 text-center px-2 flex-shrink-0 text-sm',
                    i === 0 ? 'border-t-0' : 'border-t',
                    'border-primary-30',
                    'bg-white cursor-pointer hover:bg-primary-20/10',
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
                      'w-full h-12 text-left px-4 flex-shrink-0 text-sm',
                      'border-b border-primary-30',
                      'bg-white cursor-pointer hover:bg-primary-20/10',
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
        <div className="w-[60vw] max-w-sm md:max-w-lg mb-8">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!region || ((CITIES[region] || []).length > 0 && !city)}
            className={`w-full h-[6.5vh] rounded-[12px] text-[20px] font-semibold leading-[140%] tracking-[-2.5%] transition-colors ${
              region && ((CITIES[region] || []).length === 0 || city)
                ? 'bg-primary-90 text-white cursor-pointer'
                : 'bg-primary-20 text-black cursor-not-allowed'
            }`}
          >
            선택완료
          </button>
        </div>
      </div>
    </div>
  );
}
