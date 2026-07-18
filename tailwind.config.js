/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2f9',
          100: '#d7e0f0',
          200: '#b0c1e1',
          300: '#88a2d2',
          400: '#5678b8',
          500: '#33518f',
          600: '#25396b',
          700: '#1E3A8A',
          800: '#152a5e',
          850: '#111f47',
          900: '#0F172A',
          950: '#080c17',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 23 42 / 0.06), 0 1px 3px 0 rgb(15 23 42 / 0.08)',
        'card-hover':
          '0 4px 6px -1px rgb(15 23 42 / 0.08), 0 8px 16px -4px rgb(15 23 42 / 0.10)',
      },
    },
  },
  plugins: [],
}
