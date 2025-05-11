declare module '#app' {
  interface NuxtApp {
    $spotify: {
      getAuthUrl: () => string
      checkAuth: () => Promise<boolean>
      getCurrentUserProfile: () => Promise<SpotifyApi.CurrentUsersProfileResponse>
    }
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $spotify: {
      getAuthUrl: () => string
      checkAuth: () => Promise<boolean>
      getCurrentUserProfile: () => Promise<SpotifyApi.CurrentUsersProfileResponse>
    }
  }
} 