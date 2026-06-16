/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted:   '#f8fafc',
          subtle:  '#f1f5f9',
          border:  '#e2e8f0',
        },
        ink: {
          DEFAULT:   '#0f172a',
          secondary: '#334155',
          muted:     '#64748b',
          faint:     '#94a3b8',
        },
        status: {
          success: '#16a34a',
          warning: '#d97706',
          error:   '#dc2626',
          info:    '#2563eb',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '0.9rem' }],
      },
      boxShadow: {
        'card':  '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        'panel': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
        'modal': '0 25px 50px -12px rgb(0 0 0 / 0.18)',
        'glow':  '0 0 0 3px rgb(99 102 241 / 0.15)',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        'lg':    '0.625rem',
        'xl':    '0.75rem',
        '2xl':   '1rem',
        '3xl':   '1.25rem',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        'gradient-dark':  'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
        'gradient-mesh':  'radial-gradient(at 40% 20%, #4f46e5 0px, transparent 50%), radial-gradient(at 80% 0%, #7c3aed 0px, transparent 50%), radial-gradient(at 0% 50%, #4338ca 0px, transparent 50%)',
      },
      animation: {
        'fade-in':    'fadeIn 0.2s ease',
        'slide-up':   'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 },                          to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
