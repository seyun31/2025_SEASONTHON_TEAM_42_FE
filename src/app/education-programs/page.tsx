import { cookies } from 'next/headers';
import EducationProgramsClient from './EducationProgramsClient';
import { EducationSummary } from '@/types/job';

async function fetchInitialEducations(
  isLoggedIn: boolean
): Promise<{ educations: EducationSummary[]; totalElements: number }> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    return { educations: [], totalElements: 0 };
  }

  try {
    if (isLoggedIn) {
      const accessToken = (await cookies()).get('accessToken')?.value;
      if (!accessToken) {
        return { educations: [], totalElements: 0 };
      }
      // 초기 탭은 로그인 시 custom(추천)
      const response = await fetch(`${backendUrl}/education/recommend`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });
      if (!response.ok) {
        return { educations: [], totalElements: 0 };
      }
      const result = await response.json();
      if (result.result !== 'SUCCESS') {
        return { educations: [], totalElements: 0 };
      }
      const educations: EducationSummary[] = (result.data.jobDtoList || []).map(
        (item: any) => ({
          id: String(item.jobId ?? ''),
          educationId: Number(item.jobId ?? 0),
          trprId: String(item.jobId ?? ''),
          title: item.jobTitle || '제목 없음',
          subTitle: item.jobCodeName || '',
          institution: item.companyName || '',
          address: item.workLocation || '',
          traStartDate: item.postingDate || '',
          traEndDate: item.closingDate || '',
          trainTarget: '',
          contents: item.description || '',
          certificate: '',
          grade: '',
          regCourseMan: String(item.recruitNumber ?? '0'),
          courseMan: String(item.recruitNumber ?? '0'),
          realMan: '0',
          yardMan: '0',
          telNo: item.managerPhone || '',
          stdgScor: '0',
          eiEmplCnt3: '0',
          eiEmplRate3: '0',
          eiEmplCnt3Gt10: '0',
          eiEmplRate6: '0',
          ncsCd: '',
          trprDegr: '',
          instCd: '',
          trngAreaCd: '',
          trainTargetCd: '',
          trainstCstId: '',
          subTitleLink: '',
          titleLink: '',
          titleIcon: '',
          imageUrl: item.imageUrl,
          isBookmark: Boolean(item.isBookmark),
          recommendScore: item.score,
        })
      );
      return { educations, totalElements: educations.length };
    } else {
      // 비로그인 시: 내부 API 라우트를 통해 익명 전체 조회 (페이지 1, size 10)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/education/anonymous?pageNo=1&pageSize=10`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        }
      );
      if (!response.ok) {
        return { educations: [], totalElements: 0 };
      }
      const result = await response.json();
      if (result.result !== 'SUCCESS') {
        return { educations: [], totalElements: 0 };
      }
      const data = result.data;
      const educations: EducationSummary[] = (data.educationDtoList || []).map(
        (edu: any) => ({
          id: String(edu.educationId),
          educationId: Number(edu.educationId),
          trprId: String(edu.educationId),
          title: edu.title || '제목 없음',
          subTitle: edu.subTitle || '',
          institution: edu.subTitle || '',
          address: edu.address || '',
          traStartDate: edu.traStartDate || '',
          traEndDate: edu.traEndDate || '',
          trainTarget: '',
          contents: edu.keyword1 || edu.keyword2 || '',
          certificate: '',
          grade: '',
          regCourseMan: '0',
          courseMan: edu.courseMan || '0',
          realMan: '0',
          yardMan: '0',
          telNo: '',
          stdgScor: '0',
          eiEmplCnt3: '0',
          eiEmplRate3: '0',
          eiEmplCnt3Gt10: '0',
          eiEmplRate6: '0',
          ncsCd: '',
          trprDegr: edu.trprDegr || '',
          instCd: '',
          trngAreaCd: '',
          trainTargetCd: '',
          trainstCstId: '',
          subTitleLink: '',
          titleLink: edu.titleLink || '',
          titleIcon: '',
          imageUrl: edu.imageUrl || '',
          isBookmark: Boolean(edu.isBookmark),
          recommendScore: edu.score || undefined,
        })
      );
      return {
        educations,
        totalElements: data.totalElements || educations.length,
      };
    }
  } catch (_e) {
    return { educations: [], totalElements: 0 };
  }
}

export default async function EducationPrograms() {
  const cookieStore = await cookies();
  const isLoggedIn = Boolean(cookieStore.get('accessToken')?.value);
  const { educations, totalElements } =
    await fetchInitialEducations(isLoggedIn);

  return (
    <EducationProgramsClient
      initialEducations={educations}
      initialTotalElements={totalElements}
      isLoggedInInitial={isLoggedIn}
    />
  );
}
