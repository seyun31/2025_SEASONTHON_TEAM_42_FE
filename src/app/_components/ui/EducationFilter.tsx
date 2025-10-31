'use client';

import { useState, useRef, useEffect } from 'react';
import { REGIONS } from '@/data/location';

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface FilterState {
  selectedRegion: string;
  selectedDistricts: string[];
  educationType: string[];
  educationCategory: string[];
}

interface EducationFilterProps {
  onFilterChange?: (filters: FilterState) => void;
}

// 지역 데이터를 FilterOption 형태로 변환
const regionOptions: FilterOption[] = REGIONS.map((region, index) => ({
  id: `region-${index}`,
  label: region,
  value: region,
}));

const educationTypeOptions: FilterOption[] = [
  { id: 'online', label: '온라인', value: 'online' },
  { id: 'offline', label: '오프라인', value: 'offline' },
  { id: 'hybrid', label: '혼합형', value: 'hybrid' },
];

const educationCategoryOptions: FilterOption[] = [
  { id: 'programming', label: '프로그래밍', value: 'programming' },
  { id: 'design', label: '디자인', value: 'design' },
  { id: 'marketing', label: '마케팅', value: 'marketing' },
  { id: 'language', label: '언어', value: 'language' },
  { id: 'certification', label: '자격증', value: 'certification' },
  { id: 'other', label: '기타', value: 'other' },
];

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  values: string[];
  isOpen: boolean;
  onToggle: () => void;
  onChange: (values: string[]) => void;
}

interface RegionSelectorProps {
  selectedRegion: string;
  selectedDistricts: string[];
  isOpen: boolean;
  onToggle: () => void;
  onRegionChange: (region: string) => void;
  onDistrictsChange: (districts: string[]) => void;
}

function FilterDropdown({
  label,
  options,
  values,
  isOpen,
  onToggle,
  onChange,
}: FilterDropdownProps) {
  const isSelected = values.length > 0;

  const handleOptionToggle = (optionValue: string) => {
    const newValues = values.includes(optionValue)
      ? values.filter((v) => v !== optionValue)
      : [...values, optionValue];
    onChange(newValues);
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full border-2 border-primary-20 transition-colors whitespace-nowrap ${
          isSelected || isOpen
            ? 'bg-primary-20 text-gray-90'
            : 'bg-white text-gray-70 hover:border-primary-50'
        }`}
      >
        <span className="text-sm md:text-3xl">{label}</span>
        <svg
          className={`w-4 h-4 md:w-6 md:h-6 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 md:w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <div className="p-4 md:p-6">
            <div className="space-y-2 md:space-y-3">
              {options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={values.includes(option.value)}
                    onChange={() => handleOptionToggle(option.value)}
                    className="w-4 h-4 md:w-5 md:h-5 text-primary-90 border-gray-300 rounded focus:ring-primary-50"
                  />
                  <span className="text-sm md:text-2xl text-gray-70">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RegionSelector({
  selectedRegion,
  selectedDistricts,
  isOpen,
  onToggle,
  onRegionChange,
  onDistrictsChange,
}: RegionSelectorProps) {
  const [districts, setDistricts] = useState<string[]>([]);

  // 지역별 구/시 데이터
  const getDistrictsForRegion = (region: string): string[] => {
    const districtMap: { [key: string]: string[] } = {
      서울특별시: [
        '강남구',
        '강동구',
        '강북구',
        '강서구',
        '관악구',
        '광진구',
        '구로구',
        '금천구',
        '노원구',
        '도봉구',
        '동대문구',
        '동작구',
        '마포구',
        '서대문구',
        '서초구',
        '성동구',
        '성북구',
        '송파구',
        '양천구',
        '영등포구',
        '용산구',
        '은평구',
        '종로구',
        '중구',
        '중랑구',
      ],
      경기도: [
        '수원시',
        '성남시',
        '의정부시',
        '안양시',
        '부천시',
        '광명시',
        '평택시',
        '과천시',
        '오산시',
        '시흥시',
        '군포시',
        '의왕시',
        '하남시',
        '용인시',
        '파주시',
        '이천시',
        '안성시',
        '김포시',
        '화성시',
        '광주시',
        '여주시',
        '양평군',
        '가평군',
        '연천군',
      ],
      인천광역시: [
        '중구',
        '동구',
        '미추홀구',
        '연수구',
        '남동구',
        '부평구',
        '계양구',
        '서구',
        '강화군',
        '옹진군',
      ],
      부산광역시: [
        '중구',
        '서구',
        '동구',
        '영도구',
        '부산진구',
        '동래구',
        '남구',
        '북구',
        '해운대구',
        '사하구',
        '금정구',
        '강서구',
        '연제구',
        '수영구',
        '사상구',
        '기장군',
      ],
      대구광역시: [
        '중구',
        '동구',
        '서구',
        '남구',
        '북구',
        '수성구',
        '달서구',
        '달성군',
      ],
      광주광역시: ['동구', '서구', '남구', '북구', '광산구'],
      대전광역시: ['동구', '중구', '서구', '유성구', '대덕구'],
      울산광역시: ['중구', '남구', '동구', '북구', '울주군'],
      세종특별자치시: ['세종시'],
      강원도: [
        '춘천시',
        '원주시',
        '강릉시',
        '동해시',
        '태백시',
        '속초시',
        '삼척시',
        '홍천군',
        '횡성군',
        '영월군',
        '평창군',
        '정선군',
        '철원군',
        '화천군',
        '양구군',
        '인제군',
        '고성군',
        '양양군',
      ],
      충청북도: [
        '청주시',
        '충주시',
        '제천시',
        '보은군',
        '옥천군',
        '영동군',
        '증평군',
        '진천군',
        '괴산군',
        '음성군',
        '단양군',
      ],
      충청남도: [
        '천안시',
        '공주시',
        '보령시',
        '아산시',
        '서산시',
        '논산시',
        '계룡시',
        '당진시',
        '금산군',
        '부여군',
        '서천군',
        '청양군',
        '홍성군',
        '예산군',
        '태안군',
      ],
      전라북도: [
        '전주시',
        '군산시',
        '익산시',
        '정읍시',
        '남원시',
        '김제시',
        '완주군',
        '진안군',
        '무주군',
        '장수군',
        '임실군',
        '순창군',
        '고창군',
        '부안군',
      ],
      전라남도: [
        '목포시',
        '여수시',
        '순천시',
        '나주시',
        '광양시',
        '담양군',
        '곡성군',
        '구례군',
        '고흥군',
        '보성군',
        '화순군',
        '장흥군',
        '강진군',
        '해남군',
        '영암군',
        '무안군',
        '함평군',
        '영광군',
        '장성군',
        '완도군',
        '진도군',
        '신안군',
      ],
      경상북도: [
        '포항시',
        '경주시',
        '김천시',
        '안동시',
        '구미시',
        '영주시',
        '영천시',
        '상주시',
        '문경시',
        '경산시',
        '군위군',
        '의성군',
        '청송군',
        '영양군',
        '영덕군',
        '청도군',
        '고령군',
        '성주군',
        '칠곡군',
        '예천군',
        '봉화군',
        '울진군',
        '울릉군',
      ],
      경상남도: [
        '창원시',
        '진주시',
        '통영시',
        '사천시',
        '김해시',
        '밀양시',
        '거제시',
        '양산시',
        '의령군',
        '함안군',
        '창녕군',
        '고성군',
        '남해군',
        '하동군',
        '산청군',
        '함양군',
        '거창군',
        '합천군',
      ],
      제주특별자치도: ['제주시', '서귀포시'],
    };
    return districtMap[region] || [];
  };

  useEffect(() => {
    if (selectedRegion) {
      const regionDistricts = getDistrictsForRegion(selectedRegion);
      setDistricts(regionDistricts);
    } else {
      setDistricts([]);
    }
  }, [selectedRegion]);

  const handleDistrictToggle = (district: string) => {
    const newDistricts = selectedDistricts.includes(district)
      ? selectedDistricts.filter((d) => d !== district)
      : [...selectedDistricts, district];
    onDistrictsChange(newDistricts);
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full border-2 border-primary-20 transition-colors whitespace-nowrap ${
          selectedRegion || isOpen
            ? 'bg-primary-20 text-gray-90'
            : 'bg-white text-gray-70 hover:border-primary-50'
        }`}
      >
        <span className="text-sm md:text-3xl">{selectedRegion || '지역'}</span>
        <svg
          className={`w-4 h-4 md:w-6 md:h-6 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 md:w-96 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <div className="p-4 md:p-6">
            <div className="space-y-4">
              {/* 지역 선택 */}
              <div>
                <h3 className="text-sm md:text-2xl font-medium text-gray-70 mb-3">
                  지역 선택
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {regionOptions.map((region) => (
                    <button
                      key={region.id}
                      onClick={() => onRegionChange(region.value)}
                      className={`px-3 py-2 text-xs md:text-lg rounded-lg border transition-colors ${
                        selectedRegion === region.value
                          ? 'bg-primary-20 text-primary-90 border-primary-50'
                          : 'bg-white text-gray-70 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {region.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 구/시 선택 */}
              {selectedRegion && districts.length > 0 && (
                <div>
                  <h3 className="text-sm md:text-2xl font-medium text-gray-70 mb-3">
                    {selectedRegion} 구/시 선택
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {districts.map((district) => (
                      <label
                        key={district}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDistricts.includes(district)}
                          onChange={() => handleDistrictToggle(district)}
                          className="w-4 h-4 md:w-5 md:h-5 text-primary-90 border-gray-300 rounded focus:ring-primary-50"
                        />
                        <span className="text-xs md:text-lg text-gray-70">
                          {district}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EducationFilter({
  onFilterChange,
}: EducationFilterProps) {
  const filterRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FilterState>({
    selectedRegion: '',
    selectedDistricts: [],
    educationType: [],
    educationCategory: [],
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState<{
    region: boolean;
    educationType: boolean;
    educationCategory: boolean;
  }>({
    region: false,
    educationType: false,
    educationCategory: false,
  });

  const handleFilterChange = (
    key: keyof FilterState,
    values: string[] | string
  ) => {
    const newFilters = { ...filters, [key]: values };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleRegionChange = (region: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedRegion: region,
      selectedDistricts: [], // 지역이 바뀌면 선택된 구/시 초기화
    }));
  };

  const handleDistrictsChange = (districts: string[]) => {
    setFilters((prev) => ({
      ...prev,
      selectedDistricts: districts,
    }));
  };

  const toggleDropdown = (key: keyof typeof isDropdownOpen) => {
    setIsDropdownOpen((prev) => {
      // 다른 모든 드롭다운을 닫고, 현재 드롭다운만 토글
      const newState = {
        region: false,
        educationType: false,
        educationCategory: false,
      };
      newState[key] = !prev[key];
      return newState;
    });
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen({
          region: false,
          educationType: false,
          educationCategory: false,
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={filterRef} className="w-full mt-6">
      {/* 필터 바 */}
      <div className="flex flex-row items-stretch md:items-center gap-3 md:gap-4">
        {/* 지역 필터 */}
        <RegionSelector
          selectedRegion={filters.selectedRegion}
          selectedDistricts={filters.selectedDistricts}
          isOpen={isDropdownOpen.region}
          onToggle={() => toggleDropdown('region')}
          onRegionChange={handleRegionChange}
          onDistrictsChange={handleDistrictsChange}
        />

        {/* 교육형태 필터 */}
        <FilterDropdown
          label="교육형태"
          options={educationTypeOptions}
          values={filters.educationType}
          isOpen={isDropdownOpen.educationType}
          onToggle={() => toggleDropdown('educationType')}
          onChange={(values) => handleFilterChange('educationType', values)}
        />

        {/* 교육분야 필터 */}
        <FilterDropdown
          label="교육분야"
          options={educationCategoryOptions}
          values={filters.educationCategory}
          isOpen={isDropdownOpen.educationCategory}
          onToggle={() => toggleDropdown('educationCategory')}
          onChange={(values) => handleFilterChange('educationCategory', values)}
        />

        {/* 데스크탑용 필터 적용하기 버튼 */}
        <button
          onClick={() => onFilterChange?.(filters)}
          className="hidden md:block ml-auto px-6 py-3 bg-primary-90 text-white rounded-xl text-body-medium font-medium hover:bg-primary-80 transition-colors"
        >
          필터 적용하기
        </button>
      </div>

      {/* 모바일용 필터 적용하기 버튼 */}
      <div className="mt-4 md:hidden flex justify-start">
        <button
          onClick={() => onFilterChange?.(filters)}
          className="px-6 py-3 bg-primary-90 text-white rounded-xl text-body-medium font-medium hover:bg-primary-80 transition-colors"
        >
          필터 적용하기
        </button>
      </div>
    </div>
  );
}
