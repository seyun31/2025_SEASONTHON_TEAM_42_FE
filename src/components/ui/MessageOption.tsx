'use client';

import { useState } from 'react';

interface MessageOptionProps {
  children: React.ReactNode;
  onClick?: (selected: boolean) => void;
}

export default function MessageOption({
  children,
  onClick,
}: MessageOptionProps) {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    const newSelected = !isSelected;
    setIsSelected(newSelected);
    onClick?.(newSelected);
  };

  return (
    <div
      className={`flex items-center justify-center border-2 border-secondary1 rounded-[100px] overflow-hidden max-w-[30vw] px-4 py-2 cursor-pointer transition-colors text-chat-message ${
        isSelected ? 'bg-secondary1 text-black' : 'text-black'
      }`}
      style={!isSelected ? { backgroundColor: 'white' } : {}}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
