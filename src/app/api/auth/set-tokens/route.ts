import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken, refreshToken } = body;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: '토큰이 필요합니다.' },
        { status: 400 }
      );
    }

    // 응답 생성
    const response = NextResponse.json({ success: true });

    // 쿠키 설정 (Secure 플래그 포함, HTTPS 환경 대응)
    response.cookies.set('accessToken', accessToken, {
      httpOnly: false, // 클라이언트 JavaScript에서 접근 가능 (auth.ts에서 사용)
      secure: process.env.NODE_ENV === 'production', // HTTPS일 때만
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7일
      path: '/',
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: false, // 클라이언트 JavaScript에서 접근 가능
      secure: process.env.NODE_ENV === 'production', // HTTPS일 때만
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30일
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('토큰 저장 중 오류:', error);
    return NextResponse.json(
      { error: '토큰 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
}
