<template>
    <div class="flex flex-col items-center justify-center">
      <div class="mb-6">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 0C10.745 0 0 10.745 0 24C0 37.255 10.745 48 24 48C37.255 48 48 37.255 48 24C48 10.745 37.255 0 24 0ZM34.95 34.614C34.541 35.264 33.714 35.468 33.064 35.06C27.395 31.718 20.246 30.923 11.873 32.8C11.114 32.978 10.368 32.473 10.189 31.714C10.011 30.954 10.516 30.209 11.276 30.03C20.432 27.97 28.346 28.877 34.691 32.628C35.341 33.036 35.545 33.864 34.95 34.614ZM37.878 28.082C37.369 28.887 36.337 29.145 35.532 28.636C29.059 24.764 19.023 23.548 11.414 25.85C10.505 26.137 9.542 25.628 9.255 24.719C8.968 23.809 9.477 22.847 10.386 22.56C19.05 19.928 30.091 21.272 37.51 25.736C38.314 26.246 38.573 27.277 37.878 28.082ZM38.114 21.296C30.373 16.804 17.628 16.382 10.268 18.632C9.177 18.978 8.027 18.364 7.682 17.273C7.336 16.183 7.95 15.032 9.041 14.687C17.415 12.132 31.324 12.623 40.082 17.728C41.078 18.323 41.395 19.586 40.8 20.582C40.205 21.577 38.941 21.894 37.946 21.3L38.114 21.296Z" fill="#1DB954"/>
        </svg>
      </div>
      <h2 class="text-2xl font-bold mb-4">Se connecter à Spotify</h2>
      <p class="text-gray-400 mb-8 text-center max-w-md">Connectez-vous avec votre compte Spotify pour accéder à toutes les fonctionnalités de cette application.</p>
      <button 
        class="bg-spotify-green hover:bg-green-400 text-white font-bold py-3 px-8 rounded-full"
        @click="login"
      >
        Se connecter avec Spotify
      </button>
    </div>
  </template>
  
  <script>
  import { useSpotify } from '~/composables/useSpotify'
  
  const spotify = useSpotify()
  
  const login = () => {
    const authUrl = spotify.getAuthUrl()
    window.location.href = authUrl
  }
  </script>