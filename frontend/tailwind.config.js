/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta TheBunker - Moderna y Masculina
        primary: {
          50: '#faf5f0',
          100: '#f5eadb',
          200: '#e9d3b6',
          300: '#dab487',
          400: '#ca9259',
          500: '#c17e3e',
          600: '#b36633',
          700: '#954f2c',
          800: '#794129',
          900: '#633723',
        },
        dark: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#0a0a0a',
          950: '#000000',
        },
      },
      fontFamily: {
        'display': ['Oswald', 'sans-serif'],
        'body': ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(193, 126, 62, 0.3)',
        'glow-lg': '0 0 40px rgba(193, 126, 62, 0.5)',
      },
    },
  },
  plugins: [],
}
