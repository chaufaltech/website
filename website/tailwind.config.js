/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D1B2A',
          light: '#1B263B',
          deep: '#081422',
          card: '#161F45',
        },
        orange: {
          DEFAULT: '#FF7A00',
          light: '#FF8A4C',
          dark: '#D85F1C',
        },
        amber: '#FFB067',
        paper: '#FAF8F3',
        cream: '#F5F1E8',
        ink: '#12181F',
        muted: '#64748B',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        'grid-dark': 'linear-gradient(rgba(13,27,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(13,27,42,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '36px 36px',
      },
    },
  },
  plugins: [],
}
