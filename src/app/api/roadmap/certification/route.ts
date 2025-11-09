import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(req: Request) {
  try {
    console.log('[Certification API] 요청 시작');

    // 프론트에서 보낸 body 읽기
    const body = await req.json();
    // console.log('[Certification API] 요청 body:', body);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          result: 'ERROR',
          data: null,
          error: { code: 'UNAUTHORIZED', message: '인증 토큰이 필요합니다.' },
        },
        { status: 401 }
      );
    }

    // 백엔드로 요청 전달
    const backendRes = await fetch(`${backendUrl}/roadmap/certification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    console.log('[Certification API] 백엔드 응답 상태:', backendRes.status);

    // 401 에러 - accessToken 만료, refresh 시도
    if (backendRes.status === 401) {
      const refreshToken = cookieStore.get('refreshToken')?.value;

      if (!refreshToken) {
        return NextResponse.json(
          {
            result: 'ERROR',
            data: null,
            error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다.' },
          },
          { status: 401 }
        );
      }

      // refresh token으로 새 토큰 발급
      try {
        const refreshResponse = await fetch(
          `${backendUrl}/v1/auth/refresh-token`,
          {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          }
        );

        if (!refreshResponse.ok) {
          return NextResponse.json(
            {
              result: 'ERROR',
              data: null,
              error: {
                code: 'UNAUTHORIZED',
                message: '인증이 만료되었습니다.',
              },
            },
            { status: 401 }
          );
        }

        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.data?.accessToken;
        const newRefreshToken = refreshData.data?.refreshToken;

        if (!newAccessToken || !newRefreshToken) {
          return NextResponse.json(
            {
              result: 'ERROR',
              data: null,
              error: { code: 'UNAUTHORIZED', message: '토큰 갱신 실패' },
            },
            { status: 401 }
          );
        }

        // 새 accessToken으로 다시 시도
        const retryResponse = await fetch(
          `${backendUrl}/v1/roadmap/certification`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              accept: 'application/json',
              Authorization: `Bearer ${newAccessToken}`,
            },
            body: JSON.stringify(body),
          }
        );

        if (!retryResponse.ok) {
          console.log('[Certification API] 재시도 실패:', retryResponse.status);
          const errorData = await retryResponse.json();
          return NextResponse.json(errorData, { status: retryResponse.status });
        }

        const data = await retryResponse.json();
        console.log('[Certification API] 재시도 성공');

        // 새 토큰을 쿠키에 저장
        const response = new NextResponse(JSON.stringify(data), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // 쿠키 설정
        const cookieStore = await cookies();
        cookieStore.set('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 3600, // 1시간
        });
        cookieStore.set('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 604800, // 7일
        });

        return response;
      } catch (refreshError) {
        console.error('[Certification API] refresh 중 예외:', refreshError);
        return NextResponse.json(
          {
            result: 'ERROR',
            data: null,
            error: {
              code: 'REFRESH_ERROR',
              message: '토큰 갱신 중 오류가 발생했습니다.',
            },
          },
          { status: 401 }
        );
      }
    }

    // 정상 응답
    if (!backendRes.ok) {
      const errorData = await backendRes.json();
      console.error(
        '[Certification API] 백엔드 에러:',
        JSON.stringify(errorData)
      );
      return new NextResponse(JSON.stringify(errorData), {
        status: backendRes.status,
      });
    }

    const data = await backendRes.json();
    console.log('[Certification API] 성공:', data);
    return new NextResponse(JSON.stringify(data), {
      status: backendRes.status,
    });
  } catch (error) {
    console.error('[Certification API] 예외 발생:', error);

    return NextResponse.json(
      {
        result: 'ERROR',
        data: null,
        error: {
          code: 'PROXY_ERROR',
          message: '자격증 추천을 가져오는 중 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}
