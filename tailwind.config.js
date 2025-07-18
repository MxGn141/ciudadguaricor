/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
        'guarico': {
          'blue': '#0088FF',      // Azul brillante principal
          'light-blue': '#00B7FF', // Azul claro
          'dark-blue': '#0066CC',  // Azul oscuro
          'gold': '#FFD700',      // Dorado de la bandera
          'green': '#006400',     // Verde de la bandera
          'light-gold': '#FFE55C',  // Variante clara del dorado
          'light-green': '#228B22', // Variante clara del verde
          'dark-gold': '#B8860B',   // Variante oscura del dorado
          'dark-green': '#004000',  // Variante oscura del verde
          'white': '#FFFFFF',     // Blanco del texto y contornos
          'black': '#000000',     // Negro del fondo
        },
=======
        'guarico-blue': {
          DEFAULT: '#0074D9', // Azul principal
          dark: '#003366',   // Azul oscuro
        },
        'guarico-green': '#00843D', // Verde bandera
        'guarico-yellow': '#FFD600', // Amarillo bandera
        'guarico-black': '#000000',
        'guarico-white': '#FFFFFF',
>>>>>>> b280d1bf9bedb1668e1d35ea6ca2713a3f1352b4
      },
    },
  },
  plugins: [],
};
