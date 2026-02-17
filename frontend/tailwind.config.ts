import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5869A8',
        secondary: '#8A97C4',
        white: '#FFFFFF',
      },
      fontFamily: {
        sans: ['var(--font-pt-serif)', 'PT Serif', 'Georgia', 'Times New Roman', 'serif'],
        serif: ['var(--font-pt-serif)', 'PT Serif', 'Georgia', 'Times New Roman', 'serif'],
        'serif-legacy': ['var(--font-pt-serif)', 'PT Serif', 'Georgia', 'Times New Roman', 'serif'],
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-up-soft': 'slide-up-soft 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up-soft': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionDuration: {
        '400': '400ms',
      },
      scale: {
        '108': '1.08',
      },
    },
  },
  plugins: [],
}
export default config
