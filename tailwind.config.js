/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1229',
          light: '#131B3A',
          card: '#161F45',
        },
        orange: {
          DEFAULT: '#F2762E',
          light: '#FF8A4C',
          dark: '#D85F1C',
        },
        cream: '#FDEAE0',
        ink: '#111827',
        muted: '#64748B',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
