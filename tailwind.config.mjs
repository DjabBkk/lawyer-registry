/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FEFDFB',
          100: '#FBF8F3',
          200: '#F5EFE6',
          300: '#E8DFD0',
          400: '#DDD4C3',
        },
        royal: {
          50: '#E8EEF5',
          100: '#CCDAEA',
          200: '#9FBAD9',
          300: '#6E96C4',
          400: '#4A78AD',
          500: '#2F5A8F',
          600: '#234775',
          700: '#1B3A5E',
          800: '#152D4A',
          900: '#0F2137',
          950: '#091626',
        },
        warm: {
          100: '#F5F1EB',
          200: '#E6DFD3',
          300: '#D1C6B6',
          400: '#AEA08D',
          500: '#8A7C68',
          600: '#6B5F4E',
        },
        gold: {
          300: '#E9D5A3',
          400: '#D9C07A',
          500: '#C8AB58',
          600: '#B59643',
          700: '#967A33',
        },
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
