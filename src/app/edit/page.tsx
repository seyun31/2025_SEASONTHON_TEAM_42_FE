'use client';

import Footer from '@/components/layout/Footer';
import AddressButton from '@/components/ui/AddressButton';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserData } from '@/lib/types/user';

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/user');
        const result = await response.json();

        if (result.result === 'SUCCESS' && result.data) {
          const user = result.data;
          setUserData(user);
          setName(user.name || '');
          setBirthDate(user.additionalInfo?.birthDate || '');
          setSelectedGender(
            user.additionalInfo?.gender === 'MALE'
              ? '남자'
              : user.additionalInfo?.gender === 'FEMALE'
                ? '여자'
                : ''
          );
          setAddress(
            user.additionalInfo?.address
              ? `${user.additionalInfo.address.city} ${user.additionalInfo.address.street}`
              : ''
          );
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const isFormValid =
    useName.trim() !== '' && birthDate.trim() !== '' && selectedGender !== '';

  const handleCancel = () => {
    router.push('/');
  };

  const handleComplete = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center py-8">
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
                  onChange={(e) => {
                    setBirthDate(e.target.value);
                  }}
                  placeholder="1972 / 01 / 20"
                  className="my-input relative top-2 w-full h-[5vh] py-4 px-4 bg-white border-2 border-primary-30 rounded-[12px] text-body-large-medium focus:outline-none focus:border-primary-300"
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

          {/* 취소, 수정완료 버튼 */}
          <div className="flex gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-[24px] bg-gray-300 opacity-50" />
              <button
                onClick={handleCancel}
                className="relative z-10 px-8 py-4 rounded-[24px] w-[281px] h-[120px] bg-white text-gray-50 text-title-medium border-4 border-primary-40"
              >
                취소
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-[24px] bg-primary-30 opacity-50" />
              <button
                onClick={handleComplete}
                disabled={!isFormValid}
                className="relative z-10 px-8 py-4 rounded-[24px] w-[281px] h-[120px] bg-primary-90 text-white text-title-medium"
              >
                수정 완료
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
