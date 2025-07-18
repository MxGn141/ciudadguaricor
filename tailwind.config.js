/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'guarico-blue': {
          DEFAULT: '#0074D9', // Azul principal
          dark: '#003366',   // Azul oscuro
        },
        'guarico-green': '#00843D', // Verde bandera
        'guarico-yellow': '#FFD600', // Amarillo bandera
        'guarico-black': '#000000',
        'guarico-white': '#FFFFFF',
      },
    },
  },
  plugins: [],
};
