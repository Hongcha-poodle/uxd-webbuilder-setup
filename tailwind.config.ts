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
      colors: {
        // TODO: 디자인 시스템 확정 후 실제 색상 값으로 교체
        // 아래 토큰은 규칙 문서(tailwind.md)에서 참조되는 시맨틱 컬러 목록입니다.
        // 컴포넌트 작성 시 hex 임의값 대신 반드시 이 토큰을 사용해야 합니다.
        'primary-orange': '#FF9B00',       // TODO: 디자인 시스템 값으로 교체
        'text-primary': '#1D1D1F',         // TODO: 디자인 시스템 값으로 교체
        'text-secondary': '#3A3A3C',       // TODO: 디자인 시스템 값으로 교체
        'text-placeholder': '#AEAEB2',     // TODO: 디자인 시스템 값으로 교체
        'text-disabled': '#C7C7CC',        // TODO: 디자인 시스템 값으로 교체
        'bg-light-gray': '#F2F2F7',        // TODO: 디자인 시스템 값으로 교체
        'bg-lighter-gray': '#F9F9FB',      // TODO: 디자인 시스템 값으로 교체
        'border-default': '#D1D1D6',       // TODO: 디자인 시스템 값으로 교체
        'border-active': '#FF9B00',        // TODO: 디자인 시스템 값으로 교체
        'border-light': '#E5E5EA',         // TODO: 디자인 시스템 값으로 교체
        'status-error': '#FF3B30',         // TODO: 디자인 시스템 값으로 교체
      },
    },
  },
  plugins: [],
} satisfies Config
