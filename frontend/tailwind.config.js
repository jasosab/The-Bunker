/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta TheBunker - Azul, blanco y negro
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#0d8bff',
          600: '#0077ff',
          700: '#0057d9',
          800: '#0046b3',
          900: '#003a8c',
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
        'glow': '0 0 20px rgba(13, 139, 255, 0.35)',
        'glow-lg': '0 0 40px rgba(13, 139, 255, 0.55)',
      },
    },
  },
  plugins: [],
}
