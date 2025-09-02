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
      className="w-full h-[9.26vh] rounded-[12px] border-2 border-primary-90 bg-white flex items-center justify-between"
    >
      <span
        className={`my-input text-body-large-medium ${value ? 'text-gray-900' : 'text-gray-400'}`}
      >
        {value || placeholder}
      </span>
      <Image
        src="/assets/Icons/arrow-right.svg"
        alt="오른쪽 화살표"
        width={0}
        height={0}
        className="w-[1.25vw] h-[2.22vh]"
        style={{ marginRight: '20px' }}
      />
    </button>
  );
}
