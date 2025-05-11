// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'nuxt-icon'
  ],
  runtimeConfig: {
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    spotifyRedirectUri: process.env.SPOTIFY_REDIRECT_URI,
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  },
  app: {
    head: {
      title: 'Spotify Clone',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A Spotify clone built with Nuxt 3' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  imports: {
    dirs: ['composables', 'stores']
  },
  typescript: {
    strict: true
  },
  pages: true,
  nitro: {
    compatibilityDate: '2024-04-03'
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  }
}) 