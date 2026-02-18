/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto',
          'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
          'Helvetica Neue', 'sans-serif',
        ],
        serif: [
          'Iowan Old Style', 'Palatino Linotype', 'Palatino',
          'Georgia', 'Cambria', 'Times New Roman', 'serif',
        ],
        mono: [
          'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas',
          'Liberation Mono', 'Courier New', 'monospace',
        ],
      },
      colors: {
        accent: {
          DEFAULT: '#c2410c',
          dark: '#fb923c',
        },
        surface: {
          DEFAULT: '#fafaf9',
          dark: '#0c0a09',
        },
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-slow': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out both',
        'fade-in-slow': 'fade-in-slow 0.8s ease-out both',
      },
    },
  },
  plugins: [],
};
