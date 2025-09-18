import Image from 'next/image';

export default function AddressButton({
  value,
  placeholder = '주소 근처의 결과를 우선적으로 받을 수 있어요',
  onClick,
  onHover,
}: {
  value?: string;
  placeholder?: string;
  onClick?: () => void;
  onHover?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      className="w-full max-h[5vh] md:h-[10vh] rounded-[12px] border-2 border-primary-30 bg-white flex items-center justify-between px-4"
    >
      <span
        className={`text-[14px] font-medium leading-[140%] tracking-tight md:my-input text-body-large-medium ${value ? 'text-black' : 'text-gray-50'} flex-1 text-left overflow-hidden break-words`}
        style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
      >
        {value || placeholder}
      </span>
      <Image
        src="/assets/Icons/arrow-right.svg"
        alt="오른쪽 화살표"
        width={0}
        height={0}
        className="w-5 h-5 md:w-[1.25vw] md:h-[2.22vh] flex-shrink-0"
      />
    </button>
  );
}
