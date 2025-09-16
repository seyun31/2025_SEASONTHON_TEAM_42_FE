'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AddressButton from '@/components/ui/AddressButton';
import RegionSelectModal from '@/components/ui/RegionSelectModal';
import { getAccessToken } from '@/lib/auth';

export default function Signup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 페이지 로드 시 local storage에서 저장된 정보 불러오기
  useEffect(() => {
    const savedName = localStorage.getItem('signup-name');
    const savedBirthDate = localStorage.getItem('signup-birthDate');
    const savedGender = localStorage.getItem('signup-gender');
    const savedAddress = localStorage.getItem('signup-address');

    // OAuth에서 받은 사용자 데이터가 있으면 이름을 자동으로 설정
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData.name && !savedName) {
          setName(parsedUserData.name);
          localStorage.setItem('signup-name', parsedUserData.name);
        }
      } catch (error) {
        console.error('사용자 데이터 파싱 오류:', error);
      }
    }

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

  // 생년월일 포맷팅 함수
  const formatBirthDate = (value: string) => {
    const numbers = value.replace(/\D/g, ''); // 숫자 추출
    if (numbers.length > 8) return birthDate; // 8자리까지만 허용
    let formatted = '';
    if (numbers.length <= 4) {
      formatted = numbers; // 연도
    } else if (numbers.length <= 6) {
      formatted = `${numbers.slice(0, 4)} / ${numbers.slice(4)}`; // 연도 + 월
    } else {
      formatted = `${numbers.slice(0, 4)} / ${numbers.slice(4, 6)} / ${numbers.slice(6)}`; // 연도 + 월 + 일
    }

    return formatted;
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBirthDate(e.target.value);
    setBirthDate(formatted);
    localStorage.setItem('signup-birthDate', formatted);
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const accessToken = getAccessToken();

      if (!accessToken) {
        alert('로그인이 필요합니다. 다시 로그인해주세요.');
        router.push('/member/login');
        return;
      }

      // 주소를 city와 street로 분리
      const [city, street] = address ? address.split(' ') : ['', ''];

      // 성별을 백엔드 형식에 맞게 변환
      const genderMap: { [key: string]: string } = {
        남자: 'MALE',
        여자: 'FEMALE',
      };

      const profileData = {
        name: name.trim(),
        birthDate: birthDate.replace(/\s/g, '').replace(/\//g, '-'),
        gender: genderMap[selectedGender] || selectedGender,
        city: city || undefined,
        street: street || undefined,
      };

      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();

      if (result.result === 'SUCCESS') {
        // localStorage에서 회원가입 관련 임시 데이터 삭제
        localStorage.removeItem('signup-name');
        localStorage.removeItem('signup-birthDate');
        localStorage.removeItem('signup-gender');
        localStorage.removeItem('signup-address');

        // 메인 페이지로 리다이렉트
        router.push('/');
      } else {
        console.error('프로필 업데이트 실패:', result.error);
        alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {/* 사용자 정보 박스 */}
        <div className="relative w-[30.5vw] h-[67vh] bg-white border-4 border-primary-90 rounded-[32px] flex flex-col items-center">
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
                className="my-input relative top-2 w-full h-[5vh] py-4 bg-white border-2 border-primary-30 rounded-[12px] text-body-large-medium focus:outline-none focus:border-primary-300"
              />
            </div>

            {/* 생년월일 입력 */}
            <div>
              <label className="block text-body-large-medium">생년월일 *</label>
              <input
                type="text"
                value={birthDate}
                onChange={handleBirthDateChange}
                placeholder="1972 / 01 / 20"
                className="my-input relative top-2 w-full h-[5vh] py-4 bg-white border-2 border-primary-30 rounded-[12px] text-body-large-medium focus:outline-none focus:border-primary-300"
                maxLength={14}
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
                  className={`flex-1 h-[12.3vh] border-2 border-primary-30 rounded-[12px] text-body-large-medium text-gray-50 focus:outline-none transition-colors ${
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
                  className={`flex-1 h-[12.3vh] border-2 border-primary-30 rounded-[12px] text-body-large-medium text-gray-50 focus:outline-none transition-colors ${
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
                    setIsModalOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 시작하기 버튼 */}
        <div className="relative">
          <div className="absolute inset-0 rounded-[16px] bg-primary-30 opacity-50 pointer-events-none" />
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`relative z-10 w-[30.5vw] h-[11.1vh] rounded-[24px] text-title-medium transition-colors ${
              isFormValid && !isSubmitting
                ? 'bg-primary-90 text-white cursor-pointer'
                : 'bg-primary-20 text-black cursor-not-allowed'
            }`}
          >
            넥스트 커리어 시작하기
          </button>
        </div>
      </div>

      {/* 주소 선택 모달 */}
      <RegionSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(selectedAddress) => {
          setAddress(selectedAddress);
          setIsModalOpen(false);
        }}
        offsetY="-75px"
      />
    </div>
  );
}
