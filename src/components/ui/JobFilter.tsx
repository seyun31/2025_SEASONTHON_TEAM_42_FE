'use client';

import { useState } from 'react';

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface JobFilterProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  location: string;
  employmentType: string;
  jobCategory: string;
}

const locationOptions: FilterOption[] = [
  { id: 'all', label: '전체', value: 'all' },
  { id: 'seoul', label: '서울', value: 'seoul' },
  { id: 'gyeonggi', label: '경기', value: 'gyeonggi' },
  { id: 'busan', label: '부산', value: 'busan' },
  { id: 'incheon', label: '인천', value: 'incheon' },
  { id: 'daegu', label: '대구', value: 'daegu' },
  { id: 'daejeon', label: '대전', value: 'daejeon' },
  { id: 'gwangju', label: '광주', value: 'gwangju' },
  { id: 'ulsan', label: '울산', value: 'ulsan' },
  { id: 'remote', label: '원격근무', value: 'remote' },
];

const employmentTypeOptions: FilterOption[] = [
  { id: 'all', label: '전체', value: 'all' },
  { id: 'fulltime', label: '정규직', value: 'fulltime' },
  { id: 'contract', label: '계약직', value: 'contract' },
  { id: 'intern', label: '인턴', value: 'intern' },
  { id: 'parttime', label: '아르바이트', value: 'parttime' },
  { id: 'freelance', label: '프리랜서', value: 'freelance' },
];

const jobCategoryOptions: FilterOption[] = [
  { id: 'all', label: '전체', value: 'all' },
  { id: 'development', label: '개발', value: 'development' },
  { id: 'design', label: '디자인', value: 'design' },
  { id: 'marketing', label: '마케팅', value: 'marketing' },
  { id: 'sales', label: '영업', value: 'sales' },
  { id: 'hr', label: '인사', value: 'hr' },
  { id: 'finance', label: '재무', value: 'finance' },
  { id: 'management', label: '경영', value: 'management' },
];

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  value: string;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}

function FilterDropdown({
  label,
  options,
  value,
  isOpen,
  onToggle,
  onChange,
}: FilterDropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary-20 transition-colors ${
          value !== 'all' || isOpen
            ? 'bg-primary-20 text-gray-90'
            : 'bg-white text-gray-70 hover:border-primary-50'
        }`}
      >
        <span className="text-title-large">{label}</span>
        <svg
          className={`w-6 h-6 transition-transform ${
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
        <div className="absolute top-full left-0 mt-2 w-48 bg-primary-20 border border-primary-20 rounded-lg shadow-lg z-10">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.value);
                onToggle();
              }}
              className={`w-full text-left px-4 py-3 text-body-medium hover:bg-gray-5 first:rounded-t-lg last:rounded-b-lg ${
                value === option.value
                  ? 'bg-primary-10 text-primary-90'
                  : 'text-gray-70'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function JobFilter({ onFilterChange }: JobFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    location: 'all',
    employmentType: 'all',
    jobCategory: 'all',
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState<{
    location: boolean;
    employmentType: boolean;
    jobCategory: boolean;
  }>({
    location: false,
    employmentType: false,
    jobCategory: false,
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const toggleDropdown = (key: keyof typeof isDropdownOpen) => {
    setIsDropdownOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getSelectedLabel = (key: keyof FilterState) => {
    const options = {
      location: locationOptions,
      employmentType: employmentTypeOptions,
      jobCategory: jobCategoryOptions,
    }[key];

    return (
      options?.find((option) => option.value === filters[key])?.label || '전체'
    );
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== 'all'
  );

  return (
    <div className="w-full mt-6">
      {/* 필터 바 */}
      <div className="flex items-center gap-4 p-4 ">
        {/* 지역 필터 */}
        <FilterDropdown
          label="지역"
          options={locationOptions}
          value={filters.location}
          isOpen={isDropdownOpen.location}
          onToggle={() => toggleDropdown('location')}
          onChange={(value) => handleFilterChange('location', value)}
        />

        {/* 근무형태 필터 */}
        <FilterDropdown
          label="근무형태"
          options={employmentTypeOptions}
          value={filters.employmentType}
          isOpen={isDropdownOpen.employmentType}
          onToggle={() => toggleDropdown('employmentType')}
          onChange={(value) => handleFilterChange('employmentType', value)}
        />

        {/* 직무 필터 */}
        <FilterDropdown
          label="직무"
          options={jobCategoryOptions}
          value={filters.jobCategory}
          isOpen={isDropdownOpen.jobCategory}
          onToggle={() => toggleDropdown('jobCategory')}
          onChange={(value) => handleFilterChange('jobCategory', value)}
        />

        {/* 필터 적용하기 버튼 */}
        <button
          onClick={() => onFilterChange?.(filters)}
          className="ml-auto px-6 py-3 bg-primary-90 text-white rounded-xl text-body-medium font-medium hover:bg-primary-80 transition-colors"
        >
          필터 적용하기
        </button>
      </div>

      {/* 활성 필터 표시 */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (value === 'all') return null;

            const getLabel = (key: string, value: string) => {
              const optionsMap: Record<string, FilterOption[]> = {
                location: locationOptions,
                employmentType: employmentTypeOptions,
                jobCategory: jobCategoryOptions,
              };

              const options = optionsMap[key];
              return (
                options?.find((option: FilterOption) => option.value === value)
                  ?.label || value
              );
            };

            return (
              <div
                key={key}
                className="flex items-center gap-2 px-3 py-1 bg-primary-10 text-primary-90 rounded-full text-body-small"
              >
                <span>{getLabel(key, value)}</span>
                <button
                  onClick={() =>
                    handleFilterChange(key as keyof FilterState, 'all')
                  }
                  className="hover:text-primary-70"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
