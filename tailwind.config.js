/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B4513',
        secondary: '#D2B48C',
        accent: '#CD5C5C',
        paper: '#FFF8DC'
      },
      fontFamily: {
        'title': ['STKaiti', '楷体', 'serif'],
        'content': ['SimSun', '宋体', 'serif'],
        'ui': ['PingFang SC', 'Microsoft YaHei', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      }
    },
  },
  plugins: [],
}