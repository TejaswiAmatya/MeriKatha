/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pageBg:    '#F5F0E6',
        feedBg:    '#EDE8DC',
        ink:       '#1A1410',
        sindoor:   '#C0392B',
        marigold:  '#E8A020',
        maroon:    '#7B3F2B',
        himalayan: '#4A9B7E',
        sand:      '#D4C5A9',
        cardWhite: '#FFFFFF',
        peach:     '#F4D9C6',
        textBody:  '#5C4A35',
        textMuted: '#9A7B5A',
      },
      fontFamily: {
        serif:      ['Playfair Display', 'Georgia', 'serif'],
        sans:       ['Hind', 'Arial', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'Hind', 'Arial', 'sans-serif'],
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1', transform: 'scaleY(1)' },
          '25%':      { opacity: '0.9', transform: 'scaleY(0.97)' },
          '50%':      { opacity: '0.85', transform: 'scaleY(1.03) scaleX(0.98)' },
          '75%':      { opacity: '0.95', transform: 'scaleY(0.99)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ripple: {
          '0%':   { transform: 'scale(0)', opacity: '0.4' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
      },
      animation: {
        flicker: 'flicker 2s ease-in-out infinite',
        fadeUp:  'fadeUp 0.4s ease-out forwards',
        ripple:  'ripple 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
