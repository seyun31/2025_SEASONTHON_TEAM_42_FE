import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// 전체 교육 조회 (로그인 시)
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          result: 'ERROR',
          data: null,
          error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다.' },
        },
        { status: 401 }
      );
    }

    if (!backendUrl) {
      return NextResponse.json(
        {
          result: 'ERROR',
          data: null,
          error: {
            code: 'CONFIG_ERROR',
            message: 'Backend URL이 설정되지 않았습니다.',
          },
        },
        { status: 500 }
      );
    }

    // 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const page = searchParams.get('page');
    const size = searchParams.get('size');
    const startYmd = searchParams.get('startYmd');
    const endYmd = searchParams.get('endYmd');

    // 백엔드 URL 생성
    const backendApiUrl = new URL(`${backendUrl}/education/hrd-course`);
    if (keyword) backendApiUrl.searchParams.append('keyword', keyword);
    if (page) backendApiUrl.searchParams.append('page', page);
    if (size) backendApiUrl.searchParams.append('size', size);
    if (startYmd) backendApiUrl.searchParams.append('startYmd', startYmd);
    if (endYmd) backendApiUrl.searchParams.append('endYmd', endYmd);

    const response = await fetch(backendApiUrl.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API Error:', errorText);
      return NextResponse.json(
        {
          result: 'ERROR',
          data: null,
          error: {
            code: 'BACKEND_ERROR',
            message: '전체 교육 데이터를 가져오는데 실패했습니다.',
          },
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/education/all:', error);
    return NextResponse.json(
      {
        result: 'ERROR',
        data: null,
        error: {
          code: 'INTERNAL_ERROR',
          message: '서버 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}
