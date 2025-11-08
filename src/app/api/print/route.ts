import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';

interface StrengthReportCard {
  title: string;
  experience: string;
  keywords: string[];
  jobs: string[];
  iconType?: 'dart' | 'check' | 'memo' | 'led';
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function getIconEmoji(iconType: string = 'dart'): string {
  switch (iconType) {
    case 'dart':
      return '🎯';
    case 'check':
      return '✅';
    case 'memo':
      return '📝';
    case 'led':
      return '💡';
    default:
      return '🎯';
  }
}

function generateCardHtml(card: StrengthReportCard): string {
  const iconEmoji = getIconEmoji(card.iconType);

  const keywordsHtml = card.keywords
    .slice(0, 3)
    .map(
      (keyword) => `
        <span style="border-radius: 16px; padding: 6px 10px; background-color: #E6F7EC; color: #00AD38; font-size: 14px; font-weight: 500; display: inline-block; margin-right: 8px;">
          ${keyword}
        </span>
      `
    )
    .join('');

  return `
    <div style="width: 100%; max-width: 700px; hegiht-100%; border-radius: 24px; border: 2px solid #C7D6CC; background-color: white; padding: 20px; margin: 10px auto 20px auto; box-shadow: 0px 4px 8px 0px #11111120; page-break-inside: avoid;">
      <!-- 타이틀 -->
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <span style="font-size: 28px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-right: 8px;">${iconEmoji}</span>
        <h2 style="font-size: 20px; font-weight: 600; margin-left: 12px">${card.title}</h2>
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px; color: black;">

        <!-- 강점 키워드 -->
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 6px; min-width: 130px; flex-shrink: 0;">
            <p style="font-size: 18px; margin-right: 16px">🔖</p>
            <p style="font-size: 16px; font-weight: 500; margin: 0; white-space: nowrap;">강점 키워드</p>
          </div>
          <div style="flex: 1; display: flex; flex-wrap: wrap; align-items: center;">
            ${keywordsHtml}
          </div>
        </div>

        <!-- 경험 -->
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 6px; min-width: 130px; flex-shrink: 0;">
            <p style="font-size: 18px; margin-right: 16px">🎖️</p>
            <p style="font-size: 16px; font-weight: 500; margin: 0; white-space: nowrap;">경험</p>
          </div>
          <p style="flex: 1; font-size: 13px; line-height: 18px; margin-left: 8px;">${card.experience}</p>
        </div>

        <!-- 강점 어필 -->
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 6px; min-width: 130px; flex-shrink: 0;">
            <p style="font-size: 18px; margin-right: 16px">👔</p>
            <p style="font-size: 16px; font-weight: 500; margin: 0; white-space: nowrap;">강점 어필</p>
          </div>
          <p style="flex: 1; font-size: 13px; line-height: 18px; margin-left: 8px; white-space: pre-line;">
            ${card.jobs.join(', ')}
          </p>
        </div>
      </div>
    </div>
  `;
}

function generateHeaderHtml(userName: string): string {
  const logoUrl = `${BASE_URL}/assets/logos/name-logo.svg`;

  return `
    <div style="width: 95%; margin: 4px 8px; display: flex; justify-content: space-between; align-items: center;">
      <h2 style="font-size: 28px; font-weight: 600; color: black; margin: 0; margin-left: 20px; line-height: 1.4; letter-spacing: -0.025em;">
        ${userName}님의 <span style="color: #00AD38;">강점 리포트</span>
      </h2>
      <img src="${logoUrl}" alt="로고" style="width: 76px; height: 36px;" />
    </div>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cards, userName = '사용자' } = body;

    const headerHtml = generateHeaderHtml(userName);
    const cardsHtml = cards
      .map((card: StrengthReportCard) => generateCardHtml(card))
      .join('');

    const html = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          @page {
            margin-top: 60px;
            margin-bottom: 40px;
          }
          body {
            font-family: Pretendard, sans-serif;
            padding: 10px 8px;
            background-color: #ffffff;
          }
          img {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
        </style>
      </head>
      <body>
        ${headerHtml}
        ${cardsHtml}
      </body>
    </html>
    `;

    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.setContent(html, { waitUntil: 'networkidle' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=report.pdf',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      {
        error: 'PDF generation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
