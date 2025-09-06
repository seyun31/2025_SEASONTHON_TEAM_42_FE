export default function My() {
  return (
    <section className="w-full px-4 py-8">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-title-xlarge text-gray-80 mb-8 text-left">MY</h2>

        {/* 프로필 섹션 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-80">
              OOO님의 프로필
            </h3>
          </div>
        </div>

        {/* 추천 직업 카드 섹션 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-80 mb-6">
            OOO님의 추천 직업 카드
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 직업 추천 카드 1 */}
            <div className="border-2 border-yellow-200 rounded-lg p-4 bg-white">
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 relative">
                <div className="absolute top-2 right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-medium">직업명</span>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">직업 한 줄 소개</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">직업 추천도</p>
                  <p className="text-2xl font-bold text-gray-800">100%</p>
                </div>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  채용공고 확인하기
                </button>
              </div>
            </div>

            {/* 직업 적합성 카드 */}
            <div className="border-2 border-yellow-200 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-medium">OO님과의 직업 적합성</h4>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>

              {/* 강점 섹션 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">강점</span>
                  <span className="text-sm font-semibold">손재주 80%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: '80%' }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  OO직업은 섬세한 손재주를 요하는 직업으로 OOO한 경험을 바탕으로
                  우수한 손재주를 지닌 OO님에게 적합해요.
                </p>
              </div>

              {/* 근무조건 섹션 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">근무조건</span>
                  <span className="text-sm font-semibold">조건 60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: '60%' }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  OO직업은 주로 9-18시 사이에 근무가 이루어지며, 재택근무가
                  가능한 경우가 많아 OO님이 원하시는 근무 시간 조건에 적합해요.
                </p>
              </div>

              {/* 희망사항 섹션 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">희망사항</span>
                  <span className="text-sm font-semibold">조건 80%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: '80%' }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  OO직업은 OOO 자격증을 보유하고 있는 사람을 우대해요. 시간이
                  걸리더라도 교육을 수강한 후 전문성 있는 직업에 취업하고자 하는
                  OO님의 희망사항에 적합해요!
                </p>
              </div>
            </div>

            {/* 직업 추천 카드 2 */}
            <div className="border-2 border-yellow-200 rounded-lg p-4 bg-white">
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 relative">
                <div className="absolute top-2 right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-medium">직업명</span>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">직업 한 줄 소개</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">직업 추천도</p>
                  <p className="text-2xl font-bold text-gray-800">100%</p>
                </div>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  채용공고 확인하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
