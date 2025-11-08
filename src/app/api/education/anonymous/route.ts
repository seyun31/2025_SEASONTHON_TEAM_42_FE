import { cookies } from 'next/headers';
import * as Sentry from '@sentry/nextjs';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: Request): Promise<Response> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || '';
    const page = searchParams.get('page') || '';
    const size = searchParams.get('size') || '';
    const region = searchParams.get('region') || '';
    const type = searchParams.get('type') || '';

    console.log('[Education Anonymous API] Request params:', {
      keyword,
      page,
      size,
      region,
      type,
    });

    const url = new URL(`${backendUrl}/education`);
    if (keyword) url.searchParams.append('keyword', keyword);
    if (page) {
      url.searchParams.append('page', page);
    }
    if (size) {
      url.searchParams.append('size', size);
    }
    if (region) url.searchParams.append('region', region);
    if (type) url.searchParams.append('type', type);

    console.log('[Education Anonymous API] Backend URL:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        accept: 'application/json',
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
              message: '교육 정보를 가져올 수 없습니다.',
            },
          },
          { status: response.status }
        );
      }
    }

    const educationData = await response.json();
    return Response.json(educationData);
  } catch (error) {
    console.error('Education fetch error:', error);

    // Sentry에 에러 전송
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    Sentry.captureException(error, {
      tags: {
        api: 'education/anonymous',
        method: 'GET',
      },
      extra: {
        backendUrl,
        hasAccessToken: !!accessToken,
      },
    });

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
