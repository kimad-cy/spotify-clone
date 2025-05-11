import { useSpotify } from '~/composables/useSpotify'

export default defineNuxtPlugin((nuxtApp) => {
  const spotify = useSpotify()
  
  return {
    provide: {
      spotify
    }
  }
}) 