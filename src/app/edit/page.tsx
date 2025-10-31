'use client';

import AddressButton from '@/components/ui/AddressButton';
import RegionSelectModal from '@/components/ui/RegionSelectModal';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserData } from '@/types/user';

export default function EditPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [useName, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [selectedGender, setSelectedGender] = useState<'남자' | '여자' | ''>(
    ''
  );
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/user');
        const result = await response.json();

        if (result.result === 'SUCCESS' && result.data) {
          const user = result.data;
          setUserData(user);
          // userData를 로컬스토리지에 저장
          localStorage.setItem('userData', JSON.stringify(user));
          setName(user.name || '');

          // 생년월일 포맷팅
          const rawBirthDate = user.additionalInfo?.birthDate;
          if (rawBirthDate) {
            const formattedDate = rawBirthDate.replace(/-/g, ' / ');
            setBirthDate(formattedDate);
          }

          setSelectedGender(
            user.additionalInfo?.gender === 'MALE'
              ? '남자'
              : user.additionalInfo?.gender === 'FEMALE'
                ? '여자'
                : ''
          );

          // address 정보 설정 (city와 street 결합)
          const { additionalInfo } = user;
          if (
            additionalInfo?.address?.city ||
            additionalInfo?.address?.street
          ) {
            const addressParts = [
              additionalInfo.address.city,
              additionalInfo.address.street,
            ].filter(Boolean);
            setAddress(addressParts.join(' '));
          }
        } else if (result.error?.code === 'UNAUTHORIZED') {
          // 인증되지 않은 경우 로그인 페이지로 리다이렉트
          alert('로그인이 필요합니다.');
          router.push('/member/login');
        } else {
          console.error('API Error:', result.error);
          alert('사용자 정보를 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        alert('서버 연결 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const isFormValid =
    useName.trim() !== '' && birthDate.trim() !== '' && selectedGender !== '';

  const handleCancel = () => {
    router.push('/');
  };

  const handleAddressSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);

    // userData가 있다면 즉시 업데이트
    if (userData) {
      const addressParts = selectedAddress.trim().split(' ');
      const city = addressParts[0] || '';
      const street = addressParts.slice(1).join(' ') || '';

      const updatedUserData = {
        ...userData,
        additionalInfo: {
          ...userData.additionalInfo,
          address: {
            city: city,
            street: street,
          },
        },
      };

      setUserData(updatedUserData);
      // console.log('주소가 직접 업데이트되었습니다:', selectedAddress);
    }
  };

  // 생년월일 포맷팅 함수
  const formatBirthDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length > 8) return birthDate;

    let formatted = '';
    if (numbers.length <= 4) {
      formatted = numbers;
    } else if (numbers.length <= 6) {
      formatted = `${numbers.slice(0, 4)} / ${numbers.slice(4)}`;
    } else {
      formatted = `${numbers.slice(0, 4)} / ${numbers.slice(4, 6)} / ${numbers.slice(6)}`;
    }

    return formatted;
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBirthDate(e.target.value);
    setBirthDate(formatted);
  };

  const handleComplete = async () => {
    if (!isFormValid) return;

    try {
      // 생년월일 포맷팅
      const formattedBirthDate = birthDate.replace(/ \/ /g, '-');

      // 성별을 백엔드 형식으로 변환
      const genderValue =
        selectedGender === '남자'
          ? 'MALE'
          : selectedGender === '여자'
            ? 'FEMALE'
            : null;

      // 주소를 city와 street으로 분리
      const addressParts = address.trim().split(' ');
      const city = addressParts[0] || '';
      const street = addressParts.slice(1).join(' ') || '';

      const updateData = {
        name: useName.trim(),
        birthDate: formattedBirthDate,
        gender: genderValue,
        city: city,
        street: street,
      };

      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      // 응답 상태 확인
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 응답 텍스트를 먼저 확인
      const responseText = await response.text();
      console.log('서버 응답:', responseText);

      // 빈 응답 처리
      if (!responseText.trim()) {
        console.log('서버에서 빈 응답을 받았습니다.');
        alert('프로필이 성공적으로 수정되었습니다.');
        router.push('/');
        return;
      }

      // JSON 파싱 시도
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError);
        console.log('응답 내용:', responseText);
        throw new Error('서버 응답을 파싱할 수 없습니다.');
      }

      if (result.result === 'SUCCESS') {
        // 성공 시 로컬스토리지에 저장된 주소 정보 삭제
        localStorage.removeItem('editPageAddress');
        alert('프로필이 성공적으로 수정되었습니다.');
        router.push('/');
      } else {
        console.error('Profile update failed:', result.error);
        alert('프로필 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('서버 연결 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        {/* <p className="mt-4 text-gray-600 text-lg font-medium">로딩 중...</p> */}
      </div>
    );
  }

  return (
    <>
      {/* 데스크톱 레이아웃 */}
      <div className="hidden xl:flex fixed items-center justify-center inset-0 pt-5">
        <div className="flex flex-col items-center gap-8">
          {/* 사용자 정보 박스 */}
          <div className="relative w-[26vw] h-[65vh] bg-white border-4 border-primary-90 rounded-[32px] flex flex-col justify-center items-center">
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
                  value={useName}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  placeholder="이름을 입력해주세요"
                  className="my-input relative top-2 w-full h-[5vh] py-4 px-4 bg-white border-2 border-primary-30 rounded-[12px] text-body-large-medium focus:outline-none focus:border-primary-300"
                />
              </div>

              {/* 생년월일 입력 */}
              <div>
                <label className="block text-body-large-medium">
                  생년월일 *
                </label>
                <input
                  type="text"
                  value={birthDate}
                  onChange={handleBirthDateChange}
                  placeholder="1972 / 01 / 20"
                  className="my-input relative top-2 w-full h-[5vh] py-4 px-4 bg-white border-2 border-primary-30 rounded-[12px] text-body-large-medium focus:outline-none focus:border-primary-300"
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
              <div className="min-w-0">
                <label className="block text-body-large-medium">
                  거주지 (선택)
                </label>
                <div className="relative top-2">
                  <div className="overflow-hidden">
                    <AddressButton
                      value={address}
                      onClick={() => setIsModalOpen(true)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 취소, 수정완료 버튼 */}
          <div className="flex gap-4 w-[26.8vw]">
            <div className="flex-1">
              <button
                onClick={handleCancel}
                className="w-full px-8 py-4 rounded-[24px] h-[120px] bg-white text-gray-50 text-title-medium border-4 border-primary-40 cursor-pointer"
              >
                취소
              </button>
            </div>
            <div className="flex-1">
              <button
                onClick={handleComplete}
                disabled={!isFormValid}
                className="w-full px-8 py-4 rounded-[24px] h-[120px] bg-primary-90 text-white text-title-medium cursor-pointer"
              >
                수정 완료
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 주소 선택 모달 */}
      <RegionSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddressSelect}
      />
      {/* 모바일 레이아웃 */}
      <div className="flex xl:hidden w-full h-full flex-col pt-8">
        {/* 사용자 정보 영역 */}
        <div className="flex-1 flex items-center justify-center px-8 py-8">
          <div className="w-full max-w-md flex flex-col gap-4">
            {/* 이름 입력 */}
            <div>
              <label className="block text-body-large-medium">이름 *</label>
              <input
                type="text"
                value={useName}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="이름을 입력해주세요"
                className="my-input relative top-2 w-full h-[5vh] py-4 px-4 bg-white border-2 border-primary-30 rounded-[12px] text-body-large-medium focus:outline-none focus:border-primary-300"
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
                className="my-input relative top-2 w-full h-[5vh] py-4 px-4 bg-white border-2 border-primary-30 rounded-[12px] text-body-large-medium focus:outline-none focus:border-primary-300"
                maxLength={14}
              />
            </div>

            {/* 성별 선택 */}
            <div>
              <label className="block text-body-large-medium">성별 *</label>
              <div className="flex gap-4 relative top-2">
                <button
                  onClick={() => {
                    setSelectedGender('남자');
                  }}
                  className={`flex-1 h-[8vh] border-2 border-primary-30 rounded-[12px] text-body-large-medium text-gray-50 focus:outline-none transition-colors ${
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
                  }}
                  className={`flex-1 h-[8vh] border-2 border-primary-30 rounded-[12px] text-body-large-medium text-gray-50 focus:outline-none transition-colors ${
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
            <div className="min-w-0">
              <label className="block text-body-large-medium">
                거주지 (선택)
              </label>
              <div className="relative top-2">
                <div className="overflow-hidden">
                  <AddressButton
                    value={address}
                    onClick={() => setIsModalOpen(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 취소, 수정완료 버튼 */}
        <div className="flex gap-4 w-full max-w-sm sm:max-w-lg md:max-w-lg lg:max-xl items-center justify-center px-6 sm:px-8 pb-8 mx-auto">
          <button
            onClick={handleCancel}
            className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 rounded-[12px] h-[7vh] sm:h-[8vh] md:h-[9vh] lg:h-[10vh] bg-white text-gray-50 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] border-2 border-primary-40 cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={handleComplete}
            disabled={!isFormValid}
            className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 rounded-[12px] h-[7vh] sm:h-[8vh] md:h-[9vh] lg:h-[10vh] bg-primary-90 text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            수정 완료
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
    </>
  );
}
