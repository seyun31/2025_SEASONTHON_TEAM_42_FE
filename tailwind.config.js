/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '376px', // small mobile+
      sm: '768px', // tablet
      md: '768px', // tablet
      lg: '1024px', // desktop
    },
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
        sans: ['var(--font-family-primary)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-base)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
        '5xl': 'var(--font-size-5xl)',
        '6xl': 'var(--font-size-6xl)',
      },
      fontWeight: {
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
      },
      lineHeight: {
        tight: 'var(--line-height-tight)',
        normal: 'var(--line-height-normal)',
      },
      letterSpacing: {
        tight: 'var(--letter-spacing-tight)',
        normal: 'var(--letter-spacing-normal)',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease-out',
      },
    },
  },
  plugins: [],
};
