import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// 로드맵 액션 추가
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const roadmapId = params.id;
    const body = await request.json();

    const response = await fetch(
      `${backendUrl}/roadmap/${roadmapId}/roadmapAction`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API Error:', errorText);
      return NextResponse.json(
        {
          result: 'ERROR',
          data: null,
          error: {
            code: 'BACKEND_ERROR',
            message: '로드맵 액션 추가에 실패했습니다.',
          },
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/roadmap/[id]/action POST:', error);
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
