/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        faculty: {
          50: '#f3f0ff',
          100: '#e7e0ff',
          200: '#c9bbff',
          300: '#a68cff',
          400: '#8561ff',
          500: '#534AB7',
          600: '#473c99',
          700: '#3a317a',
          800: '#2f2760',
          900: '#251f4b',
        }
      }
    },
  },
  plugins: [],
}
