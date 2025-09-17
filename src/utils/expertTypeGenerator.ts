/**
 * 강점을 바탕으로 전문가 타입을 생성하는 함수
 * @param strength 강점 문자열
 * @returns 전문가 타입 문자열
 */
export const generateExpertType = (strength: string): string => {
  if (strength.includes('창의') || strength.includes('혁신')) {
    return '창의적 혁신 전문가';
  }
  if (
    strength.includes('커뮤니케이션') ||
    strength.includes('협업') ||
    strength.includes('조직')
  ) {
    return '소통형 협업 전문가';
  }
  if (
    strength.includes('데이터') ||
    strength.includes('분석') ||
    strength.includes('전략')
  ) {
    return '데이터 분석형 전략 전문가';
  }
  if (
    strength.includes('고객') ||
    strength.includes('서비스') ||
    strength.includes('피드백')
  ) {
    return '고객 중심 서비스 전문가';
  }
  if (strength.includes('문제') && strength.includes('해결')) {
    return '문제 해결형 전문가';
  }
  if (
    strength.includes('리더') ||
    strength.includes('관리') ||
    strength.includes('팀')
  ) {
    return '리더십 관리 전문가';
  }
  return '다재다능형 전문가';
};
