<template>
  <NuxtLayout>
    <div class="min-h-screen bg-black text-white">
      <!-- Main Layout -->
      <div v-if="isLogged" class="flex h-screen">
        <!-- Main Content -->
        <div class="flex-1 bg-gradient-to-b from-gray-900 to-black overflow-y-auto">
          <NuxtPage />
        </div>
      </div>

      <!-- Login Page -->
      <div v-else class="min-h-screen bg-black">
        <!-- Top Bar -->
        <div class="top-4 left-4 right-4 bg-black/80 backdrop-blur-md z-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
              <!-- Logo -->
              <div class="flex-shrink-0">
                <svg class="h-8 w-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 0C10.745 0 0 10.745 0 24C0 37.255 10.745 48 24 48C37.255 48 48 37.255 48 24C48 10.745 37.255 0 24 0ZM34.95 34.614C34.541 35.264 33.714 35.468 33.064 35.06C27.395 31.718 20.246 30.923 11.873 32.8C11.114 32.978 10.368 32.473 10.189 31.714C10.011 30.954 10.516 30.209 11.276 30.03C20.432 27.97 28.346 28.877 34.691 32.628C35.341 33.036 35.545 33.864 34.95 34.614ZM37.878 28.082C37.369 28.887 36.337 29.145 35.532 28.636C29.059 24.764 19.023 23.548 11.414 25.85C10.505 26.137 9.542 25.628 9.255 24.719C8.968 23.809 9.477 22.847 10.386 22.56C19.05 19.928 30.091 21.272 37.51 25.736C38.314 26.246 38.573 27.277 37.878 28.082ZM38.114 21.296C30.373 16.804 17.628 16.382 10.268 18.632C9.177 18.978 8.027 18.364 7.682 17.273C7.336 16.183 7.95 15.032 9.041 14.687C17.415 12.132 31.324 12.623 40.082 17.728C41.078 18.323 41.395 19.586 40.8 20.582C40.205 21.577 38.941 21.894 37.946 21.3L38.114 21.296Z" fill="#1DB954"/>
                </svg>
              </div>
              <!-- Connect Button -->
              <button 
                @click="login"
                class="bg-spotify-green hover:bg-opacity-90 text-black font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105"
              >
                SE CONNECTER
              </button>
            </div>
          </div>
        </div>
        <NuxtPage />
      </div>

      <!-- Player -->
      <div v-if="isLogged" class="fixed bottom-0 left-0 right-0 bg-[#0d0d0d] border-t border-gray-800 p-4">
        <div class="flex items-center justify-between">
          <!-- Now Playing -->
          <div class="flex items-center space-x-4">
            <img 
              :src="currentTrack?.album?.images?.[0]?.url" 
              :alt="currentTrack?.name"
              class="w-14 h-14 rounded"
            />
            <div>
              <h4 class="text-sm font-medium">{{ currentTrack?.name }}</h4>
              <p class="text-xs text-gray-400">{{ artistNames }}</p>
            </div>
          </div>

          <!-- Player Controls -->
          <div class="flex flex-col items-center">
            <div class="flex items-center space-x-6">
              <button class="text-gray-400 hover:text-white">
                <Icon name="mdi:shuffle" class="text-xl" />
              </button>
              <button class="text-gray-400 hover:text-white">
                <Icon name="mdi:skip-previous" class="text-3xl" />
              </button>
              <button class="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform">
                <Icon name="mdi:play" class="text-black text-xl" />
              </button>
              <button class="text-gray-400 hover:text-white">
                <Icon name="mdi:skip-next" class="text-3xl" />
              </button>
              <button class="text-gray-400 hover:text-white">
                <Icon name="mdi:repeat" class="text-xl" />
              </button>
            </div>
            <div class="flex items-center space-x-2 w-full max-w-md mt-2">
              <span class="text-xs text-gray-400">0:00</span>
              <div class="flex-1 h-1 bg-gray-600 rounded-full">
                <div class="w-0 h-full bg-white rounded-full"></div>
              </div>
              <span class="text-xs text-gray-400">0:00</span>
            </div>
          </div>

          <!-- Volume Control -->
          <div class="flex items-center space-x-2">
            <button class="text-gray-400 hover:text-white">
              <Icon name="mdi:volume-high" class="text-xl" />
            </button>
            <div class="w-24 h-1 bg-gray-600 rounded-full">
              <div class="w-1/2 h-full bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNuxtApp } from 'nuxt/app'
import { usePlayerStore } from '~/stores/player'

const { $spotify } = useNuxtApp()
const playerStore = usePlayerStore()

const userProfile = ref(null)
const isLogged = ref(false)

const currentTrack = computed(() => playerStore.currentTrack)

const artistNames = computed(() =>
  currentTrack.value?.artists?.map(a => a.name).join(', ') || ''
)

const login = () => {
  const authUrl = $spotify.getAuthUrl()
  window.location.href = authUrl
}

const checkAuthentication = async () => {
  try {
    const isAuthenticated = await $spotify.checkAuth()
    if (isAuthenticated) {
      isLogged.value = true
      userProfile.value = await $spotify.getCurrentUserProfile()
      await playerStore.initialize()
    }
  } catch (error) {
    console.error('Authentication check failed:', error)
  }
}

onMounted(() => {
  checkAuthentication()
})
</script>

<style>
.bg-spotify-green {
  background-color: #1DB954;
}
</style>