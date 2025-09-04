'use client';

import { aiCoachCards } from '@/mock/aiCoachData';

export default function AICoachSection() {
  return (
    <section className="w-full px-4 py-8">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-title-xlarge text-gray-80 mb-8 text-left">
          AI 코치와 함께 넥스트 커리어를 준비해봐요!
        </h2>

        <div className="flex flex-col xl:flex-row gap-6 justify-center items-center">
          {aiCoachCards.map((card) => (
            <div
              key={card.id}
              className="relative bg-orange-200 rounded-2xl p-8 text-gray-80 overflow-hidden h-[200px] w-[588px] flex-shrink-0"
            >
              <div className="relative z-10">
                <h3 className="text-title-medium mb-3">{card.title}</h3>
                <p className="text-body-medium-regular mb-6">{card.subtitle}</p>
                <button className="bg-white text-gray-80 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  시작하기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
