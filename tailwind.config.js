/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'botanico': {
          verde: '#4A6741',
          nude: '#FDF5E6',
          tierra: '#7A5C4F',
          arena: '#E5E0D8',
        }
      },
      // --- AÑADE ESTO DE AQUÍ ABAJO ---
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
      },
      // --- HASTA AQUÍ ---
    },
  },
  plugins: [],
}