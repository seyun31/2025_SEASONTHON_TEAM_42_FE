'use client';

import { useRouter } from 'next/navigation';
import { aiCoachCards } from '@/mock/aiCoachData';
import { IoIosArrowForward } from 'react-icons/io';

export default function AICoachSection() {
  const router = useRouter();

  const handleStartClick = (cardId: string) => {
    if (cardId === 'second-career') {
      router.push('/ai-chat/job');
    } else {
      router.push('/ai-chat/roadmap');
    }
  };
  return (
    <section className="w-full px-4 py-8">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-title-xlarge text-gray-80 mb-8 text-left">
          AI 코치와 함께 넥스트 커리어를 준비해봐요!
        </h2>

        <div className="flex flex-col xl:flex-row gap-6 justify-center items-center">
          {aiCoachCards.map((card, index) => (
            <div
              key={card.id}
              className="relative bg-white rounded-3xl px-5 py-6 text-gray-80 overflow-hidden h-[200px] w-[588px] flex-shrink-0 cursor-pointer"
              onClick={() => handleStartClick(card.id)}
              style={{
                border: '4px solid #E1F5EC',
                boxShadow: '0 4px 10px 0 rgba(17, 17, 17, 0.20)',
              }}
            >
              <div className="relative z-10 ">
                <h3 className="text-title-medium ">{card.title}</h3>
                <p className="text-title-medium text-primary-90 mb-14">
                  {card.subtitle}
                </p>
                <button className="bg-white text-gray-80 rounded-lg font-medium flex flex-row items-center gap-2">
                  시작하기
                  <IoIosArrowForward className="w-4 h-4" />
                </button>
              </div>

              {/* 캐릭터 이미지 - 오른쪽에 배치 */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
                <img
                  src={
                    index % 2 === 0
                      ? '/assets/Icons/character_hi.png'
                      : '/assets/Icons/character_running.png'
                  }
                  alt={`캐릭터 ${index % 2 === 0 ? 'hi' : 'running'}`}
                  className="w-auto h-40 object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
