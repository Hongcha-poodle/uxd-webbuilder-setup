import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      maxWidth: {
        container: '768px',
      },
    },
  },
  plugins: [],
} satisfies Config
