/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
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
          // Nuevos colores para mejor armonía
          'primary': '#0066CC',   // Azul principal más oscuro
          'secondary': '#FFD700', // Dorado como secundario
          'accent': '#006400',    // Verde como acento
        },
      },
      fontFamily: {
        'serif': ['Merriweather', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'guarico': '0 4px 6px -1px rgba(0, 102, 204, 0.1), 0 2px 4px -1px rgba(0, 102, 204, 0.06)',
      },
    },
  },
  plugins: [],
}
