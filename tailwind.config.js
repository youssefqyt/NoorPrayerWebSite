/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#070d1a',
        secondary: '#0d1626',
        surface: '#111f35',
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        display: ['Cinzel', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
