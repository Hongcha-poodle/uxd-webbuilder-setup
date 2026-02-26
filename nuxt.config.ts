export default defineNuxtConfig({
  compatibilityDate: '2026-01-29',
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  typescript: {
    strict: true,
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
      pattern: '*.vue',
    },
  ],
  app: {
    head: {
      title: 'Adinsu MV6 Dev Test',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        {
          rel: 'stylesheet',
          as: 'style',
          crossorigin: 'anonymous',
          href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css'
        }
      ]
    },
  },
})
