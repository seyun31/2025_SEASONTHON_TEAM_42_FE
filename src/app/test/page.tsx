import Text from '@/components/ui/Text';

export default function test() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
          <Text variant="header-large" as="h1">
            NextCareer
          </Text>

          <Text variant="title-medium" className="text-gray-600 max-w-2xl">
            당신의 커리어를 위한 플랫폼입니다.
          </Text>

          <Text variant="body-large-regular" className="text-gray-500 max-w-lg">
            개발하기 편하게 준비된 깔끔한 프로젝트입니다.
          </Text>
        </div>

        {/* Typography 샘플 */}
        <section className="mt-16 space-y-8">
          <Text variant="title-large" as="h2">
            Typography 샘플
          </Text>

          <div className="grid gap-4">
            <div>
              <Text variant="caption-small" className="text-gray-400 mb-2">
                Header Large
              </Text>
              <Text variant="header-large">헤더 라지 텍스트</Text>
            </div>

            <div>
              <Text variant="caption-small" className="text-gray-400 mb-2">
                Header Medium
              </Text>
              <Text variant="header-medium">헤더 미디엄 텍스트</Text>
            </div>

            <div>
              <Text variant="caption-small" className="text-gray-400 mb-2">
                Title XLarge
              </Text>
              <Text variant="title-xlarge">타이틀 XL 텍스트</Text>
            </div>

            <div>
              <Text variant="caption-small" className="text-gray-400 mb-2">
                Body Large Medium
              </Text>
              <Text variant="body-large-medium">
                바디 라지 미디엄 텍스트입니다. 이것은 조금 더 굵은 폰트 웨이트를
                가지고 있습니다.
              </Text>
            </div>

            <div>
              <Text variant="caption-small" className="text-gray-400 mb-2">
                Body Medium Regular
              </Text>
              <Text variant="body-medium-regular">
                바디 미디엄 레귤러 텍스트입니다. 일반적인 본문 텍스트로
                사용됩니다.
              </Text>
            </div>

            <div>
              <Text variant="caption-small" className="text-gray-400 mb-2">
                Caption Large
              </Text>
              <Text variant="caption-large">캡션 라지 텍스트</Text>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
