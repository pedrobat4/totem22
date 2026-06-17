/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta oficial — usar exatamente estes valores.
        lime: '#94BC22', // ação primária
        teal: '#03A095', // superfícies
        gold: '#D9DC00', // SÓ para o momento de vitória
        graphite: {
          DEFAULT: '#3D3E3E', // fundo/texto
          950: '#1b1c1c',
          900: '#242525',
          800: '#3D3E3E',
          700: '#515252',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      keyframes: {
        touchpulse: {
          '0%,100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(148,188,34,.5)' },
          '50%': { transform: 'scale(1.06)', boxShadow: '0 0 0 26px rgba(148,188,34,0)' },
        },
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      animation: {
        touchpulse: 'touchpulse 2s ease-in-out infinite',
        floaty: 'floaty 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
