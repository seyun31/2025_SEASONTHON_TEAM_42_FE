'use client';

import { useState } from 'react';
import { REGIONS, CITIES } from '@/data/location';

type RegionType = (typeof REGIONS)[number];

type Props = {
  /** 선택 시 상위로 알려주고 싶을 때 */
  onSelect?: (region: string, city: string) => void;
  /** 높이가 작게 보이면 늘려도 됨 */
  minHeightClass?: string; // e.g. "min-h-[288px]"
};

export default function RegionCityPicker({
  onSelect,
  minHeightClass = 'min-h-[288px]',
}: Props) {
  const [region, setRegion] = useState<RegionType>(REGIONS[0]);
  const [city, setCity] = useState<string | null>(null);

  const selectRegion = (r: RegionType) => {
    setRegion(r);
    setCity(null);
  };

  const selectCity = (c: string) => {
    setCity(c);
    onSelect?.(region, c);
  };

  return (
    <div className="w-[540px] rounded-[24px] border-2 border-primary-90 overflow-hidden bg-white">
      <div className="grid grid-cols-[160px_1fr]">
        {/* 좌측: 시/도 */}
        <div className="bg-white">
          {REGIONS.map((r, idx) => (
            <button
              key={r}
              type="button"
              onClick={() => selectRegion(r as RegionType)}
              className={[
                'w-full h-12 text-left px-4',
                'border-t border-primary-90/60',
                idx === 0 ? 'border-t-0' : '',
                r === region ? 'bg-primary-20/20 font-medium' : 'bg-white',
                'hover:bg-primary-20/10',
              ].join(' ')}
            >
              {r}
            </button>
          ))}
        </div>

        {/* 우측: 도시 */}
        <div className="relative bg-white">
          {/* 수직 구분선 */}
          <div className="absolute left-0 top-0 h-full w-px bg-primary-90/60" />
          <div className={`${minHeightClass} p-4`}>
            {!city ? (
              <p className="text-gray-400">도시를 선택해주세요</p>
            ) : (
              <p className="text-gray-800">
                선택된 도시:{' '}
                <span className="font-medium">
                  {region} {city}
                </span>
              </p>
            )}

            <div className="mt-2 flex flex-col overflow-auto">
              {(CITIES[region] || []).map((c: string, i: number) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => selectCity(c)}
                  className={[
                    'h-12 text-left px-4',
                    'border-t border-primary-90/60',
                    i === 0 ? 'border-t' : '',
                    city === c ? 'bg-primary-20/20 font-medium' : 'bg-white',
                    'hover:bg-primary-20/10',
                  ].join(' ')}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
