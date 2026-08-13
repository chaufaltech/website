/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D1B2A',
          light: '#1B263B',
          card: '#161F45',
        },
        orange: {
          DEFAULT: '#FF7A00',
          light: '#FF8A4C',
          dark: '#D85F1C',
        },
        cream: '#FSF7FA',
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
