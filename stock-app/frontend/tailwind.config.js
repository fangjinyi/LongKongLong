/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#1a1a2e',
          800: '#16213e',
          700: '#0f3460',
        },
        accent: {
          500: '#e94560',
          400: '#ff6b6b',
        },
        success: {
          500: '#00d9a5',
        },
        warning: {
          500: '#ffc107',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Noto Sans SC', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(233, 69, 96, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(233, 69, 96, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
