import Image from 'next/image';
import { useState } from 'react';

interface SearchBarProps {
  onSearchChange?: (keyword: string) => void;
}

export default function SearchBar({ onSearchChange }: SearchBarProps) {
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
    <div className="flex border-4 border-primary-90 rounded-[100px] overflow-hidden w-[1200px] h-[100px] relative">
      <button
        type="button"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-[2.81vw] h-[5vh] flex items-center justify-center"
        onClick={() => onSearchChange?.(searchValue)}
      >
        <Image
          src="/assets/Icons/search.svg"
          alt="검색"
          width={0}
          height={0}
          className="w-[2.81vw] h-[5vh]"
        />
      </button>
      <input
        type="text"
        placeholder="직무명이나 직업 분야를 검색해보세요!"
        className="search-input flex-1 py-2 outline-none"
        value={searchValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
}
