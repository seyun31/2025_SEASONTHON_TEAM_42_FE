'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AddressButton from '@/components/ui/AddressButton';

export default function Signup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');

  // 페이지 로드 시 local storage에서 저장된 정보 불러오기
  useEffect(() => {
    const savedName = localStorage.getItem('signup-name');
    const savedBirthDate = localStorage.getItem('signup-birthDate');
    const savedGender = localStorage.getItem('signup-gender');
    const savedAddress = localStorage.getItem('signup-address');

    if (savedName) setName(savedName);
    if (savedBirthDate) setBirthDate(savedBirthDate);
    if (savedGender) setSelectedGender(savedGender);
    if (savedAddress) setAddress(savedAddress);
  }, []);

  // URL 쿼리 파라미터에서 주소 정보 받아오기
  useEffect(() => {
    const addressFromQuery = searchParams.get('address');
    if (addressFromQuery) {
      setAddress(addressFromQuery);
      localStorage.setItem('signup-address', addressFromQuery);
    }
  }, [searchParams]);

  // 필수 필드가 모두 입력되었는지 확인
  const isFormValid =
    name.trim() !== '' && birthDate.trim() !== '' && selectedGender !== '';

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* 사용자 정보 박스 */}
        <div className="relative w-[30.5vw] h-[67vh] border-4 border-primary-90 rounded-[32px] flex flex-col items-center">
          <div className="absolute inset-0 rounded-[32px] bg-primary-20 opacity-50 pointer-events-none" />

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

          {/* 사용자 정보 영역 */}
          <div className="absolute top-[16%] left-[8%] right-[8%] bottom-[12%] z-10 flex flex-col gap-4">
            {/* 이름 입력 */}
            <div>
              <label className="block text-body-large-medium">이름 *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  localStorage.setItem('signup-name', e.target.value);
                }}
                placeholder="이름을 입력해주세요"
                className="my-input relative top-2 w-full h-[5vh] py-4 bg-white border-2 border-primary-90 rounded-[12px] text-body-large-medium focus:outline-none focus:border-primary-300"
              />
            </div>

            {/* 생년월일 입력 */}
            <div>
              <label className="block text-body-large-medium">생년월일 *</label>
              <input
                type="text"
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  localStorage.setItem('signup-birthDate', e.target.value);
                }}
                placeholder="1972 / 01 / 20"
                className="my-input relative top-2 w-full h-[5vh] py-4 bg-white border-2 border-primary-90 rounded-[12px] text-body-large-medium focus:outline-none focus:border-primary-300"
              />
            </div>

            {/* 성별 선택 */}
            <div>
              <label className="block text-body-large-medium">성별 *</label>
              <div className="flex gap-[1.5vw] relative top-2">
                <button
                  onClick={() => {
                    setSelectedGender('남자');
                    localStorage.setItem('signup-gender', '남자');
                  }}
                  className={`flex-1 h-[12.3vh] border-2 border-primary-90 rounded-[12px] text-body-large-medium text-gray-50 focus:outline-none transition-colors ${
                    selectedGender === '남자'
                      ? 'bg-primary-90 text-white'
                      : 'bg-white text-black hover:border-primary-300'
                  }`}
                >
                  남자
                </button>
                <button
                  onClick={() => {
                    setSelectedGender('여자');
                    localStorage.setItem('signup-gender', '여자');
                  }}
                  className={`flex-1 h-[12.3vh] border-2 border-primary-90 rounded-[12px] text-body-large-medium text-gray-50 focus:outline-none transition-colors ${
                    selectedGender === '여자'
                      ? 'bg-primary-90 text-white'
                      : 'bg-white text-black hover:border-primary-300'
                  }`}
                >
                  여자
                </button>
              </div>
            </div>

            {/* 거주지 선택 */}
            <div>
              <label className="block text-body-large-medium">
                거주지 (선택)
              </label>
              <div className="relative top-2">
                <AddressButton
                  value={address}
                  onClick={() => {
                    router.push('/member/signup/region-select');
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 시작하기 버튼 */}
        <div className="relative">
          <div className="absolute inset-0 rounded-[16px] bg-primary-20 opacity-50 pointer-events-none" />
          <button
            disabled={!isFormValid}
            className={`relative z-10 w-[30.5vw] h-[11.1vh] rounded-[24px] border-4 border-primary-90 text-title-medium transition-colors ${
              isFormValid
                ? 'bg-primary-90 text-white'
                : 'bg-primary-20 text-black cursor-not-allowed'
            }`}
          >
            넥스트 커리어 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
