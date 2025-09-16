'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface DropdownItem {
  label: string;
  path: string;
  icon?: string;
  onClick?: () => void;
}

interface MobileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  items: DropdownItem[];
  className?: string;
  showIcons?: boolean;
}

export default function MobileDropdown({
  isOpen,
  onClose,
  items,
  className = '',
  showIcons = true,
}: MobileDropdownProps) {
  const router = useRouter();

  const handleItemClick = (item: DropdownItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      router.push(item.path);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed top-[81px] right-5 w-[180px] bg-white rounded-[12px] z-50 ${className}`}
      style={{
        boxShadow: '0px 10px 20px 0px #11111126',
      }}
    >
      <div className="p-2 flex flex-col space-y-1">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => handleItemClick(item)}
            className="w-full text-left px-2 py-1.5 text-sm font-medium text-black cursor-pointer flex items-center gap-2 hover:bg-gray-50 rounded-md transition-colors"
          >
            {showIcons && item.icon && (
              <Image
                src={item.icon}
                alt={item.label}
                width={20}
                height={20}
                className="w-5 h-5"
              />
            )}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
