import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function POST() {
  try {
    // console.log("[Logout API] 로그아웃 요청 시작");

    const response = NextResponse.json({
      result: 'SUCCESS',
      message: '로그아웃되었습니다.',
    });

    // accessToken 삭제
    response.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    // refreshToken 삭제
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    // console.log("[Logout API] 쿠키 삭제 완료");

    return response;
  } catch (error) {
    console.error('[Logout API] 예외 발생:', error);

    Sentry.captureException(error, {
      tags: { api: 'auth/logout', method: 'POST' },
    });

    return NextResponse.json(
      {
        result: 'ERROR',
        error: {
          code: 'LOGOUT_ERROR',
          message: '로그아웃 중 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}
