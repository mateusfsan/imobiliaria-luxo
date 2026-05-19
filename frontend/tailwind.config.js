/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0B0C',
        surface: '#111113',
        card: '#18181B',
        gold: {
          DEFAULT: '#C6A85B',
          hover: '#B8963F',
        },
        ink: {
          primary: '#F4F4F5',
          secondary: '#A1A1AA',
        },
      },
      borderColor: {
        subtle: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['3rem', { lineHeight: '1.15' }],
        'h2': ['2.25rem', { lineHeight: '1.2' }],
        'h3': ['1.5rem', { lineHeight: '1.3' }],
        'label': ['0.75rem', { letterSpacing: '0.1em', lineHeight: '1' }],
      },
      maxWidth: {
        container: '1200px',
      },
      spacing: {
        'section': '5rem',
        'section-sm': '3rem',
      },
      transitionTimingFunction: {
        'silk': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
