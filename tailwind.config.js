/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d8eeff',
          200: '#b9e0ff',
          300: '#89ccff',
          400: '#52adff',
          500: '#2a8bff',
          600: '#146ef5',
          700: '#0e55e0',
          800: '#1144b5',
          900: '#143c8f',
          950: '#102657',
        }
      }
    },
  },
  plugins: [],
}
