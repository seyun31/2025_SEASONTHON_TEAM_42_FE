import { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';

interface SearchBarProps {
  onSearchChange?: (keyword: string) => void;
  borderColor?: string;
}

export default function SearchBar({
  onSearchChange,
  borderColor = '#00AD38',
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchChange?.(searchValue);
    }
  };

  return (
    <div
      className="flex flex-col items-start gap-[10px] w-full p-3 md:p-6 rounded-[100px] border-2 md:border-4 shadow-[0_10px_10px_0_rgba(87,134,218,0.20)]"
      style={{ borderColor }}
    >
      <div className="flex items-center w-full">
        <button
          type="button"
          className="flex items-center justify-center w-6 h-6 md:w-12 md:h-12"
          onClick={() => onSearchChange?.(searchValue)}
        >
          <IoSearchOutline className="w-6 h-6 md:w-12 md:h-12" />
        </button>
        <input
          type="text"
          placeholder="직무명이나 직업 분야를 검색해보세요!"
          className="flex-1 text-[16px] md:text-2xl outline-none border-0 bg-transparent ml-2 placeholder:text-[16px] md:placeholder:text-2xl"
          value={searchValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
}
