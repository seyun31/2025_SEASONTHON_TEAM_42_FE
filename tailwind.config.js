/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CSS 변수를 Tailwind 색상으로 매핑
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        black: 'var(--black)',
        white: 'var(--white)',
        primary: {
          600: 'var(--primary-600)',
          300: 'var(--primary-300)',
          90: 'var(--primary-90)',
          60: 'var(--primary-60)',
          40: 'var(--primary-40)',
          30: 'var(--primary-30)',
          20: 'var(--primary-20)',
        },
        gray: {
          20: 'var(--gray-20)',
          50: 'var(--gray-50)',
          70: 'var(--gray-70)',
          80: 'var(--gray-80)',
        },
        'gray-blue': {
          20: 'var(--gray-blue-20)',
          50: 'var(--gray-blue-50)',
          70: 'var(--gray-blue-70)',
        },
        secondary1: 'var(--secondary1)',
        secondary2: 'var(--secondary2)',
        secondary3: 'var(--secondary3)',
        secondary4: 'var(--secondary4)',
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
