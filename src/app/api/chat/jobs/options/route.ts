import { cookies } from 'next/headers';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: Request): Promise<Response> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return Response.json(
        {
          result: 'ERROR',
          data: null,
          error: { code: 'UNAUTHORIZED', message: '인증 토큰이 필요합니다.' },
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sequence = searchParams.get('sequence');

    if (
      !sequence ||
      isNaN(Number(sequence)) ||
      Number(sequence) < 1 ||
      Number(sequence) > 9
    ) {
      return Response.json(
        {
          result: 'ERROR',
          data: null,
          error: {
            code: 'BAD_REQUEST',
            message: 'sequence는 1-9 범위의 숫자여야 합니다.',
          },
        },
        { status: 400 }
      );
    }

    const url = new URL(`${backendUrl}/job/chat/${sequence}`);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        return Response.json(errorData, { status: response.status });
      } catch {
        return Response.json(
          {
            result: 'ERROR',
            data: null,
            error: {
              code: 'FETCH_ERROR',
              message: 'AI 채팅 옵션을 가져올 수 없습니다.',
            },
          },
          { status: response.status }
        );
      }
    }

    const optionsData = await response.json();
    return Response.json(optionsData);
  } catch (error) {
    console.error('AI chat options fetch error:', error);

    // 백엔드 API 에러 응답인 경우 그대로 전달
    if (error instanceof Error && error.message.includes('response')) {
      try {
        const errorResponse = JSON.parse(error.message);
        return Response.json(errorResponse, { status: 500 });
      } catch {}
    }

    return Response.json(
      {
        result: 'ERROR',
        data: null,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '알 수 없는 내부 오류입니다.',
        },
      },
      { status: 500 }
    );
  }
}
