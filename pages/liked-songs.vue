<template>
  <div class="p-6 bg-[#121212] min-h-screen">
    <div class="flex items-center space-x-4 mb-6">
      <div class="w-48 h-48 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg shadow-lg flex items-center justify-center">
        <svg class="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <div>
        <h1 class="text-4xl font-bold mb-2">Titres likés</h1>
        <p class="text-gray-400">{{ likedSongs?.total || 0 }} titres</p>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
    </div>

    <div v-else-if="likedSongs?.items?.length" class="space-y-2">
      <div v-for="(item, index) in likedSongs.items" :key="item.track.id" 
           class="flex items-center space-x-4 p-2 rounded hover:bg-[#282828] group">
        <span class="text-gray-400 w-8 text-center">{{ index + 1 }}</span>
        <img :src="item.track.album.images[0]?.url" :alt="item.track.name" 
             class="w-10 h-10 object-cover rounded">
        <div class="flex-1 min-w-0">
          <h3 class="font-medium text-sm truncate">{{ item.track.name }}</h3>
          <p class="text-gray-400 text-xs truncate">{{ item.track.artists.map(a => a.name).join(', ') }}</p>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-gray-400 text-sm">{{ formatDuration(item.track.duration_ms) }}</span>
          <button @click="toggleLike(item.track.id, true)" 
                  class="text-spotify-green opacity-0 group-hover:opacity-100 transition">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-400 mt-8">
      <p>Aucun titre liké</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSpotify } from '~/composables/useSpotify'

const spotify = useSpotify()
const likedSongs = ref(null)
const isLoading = ref(true)

const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const fetchLikedSongs = async () => {
  try {
    const response = await spotify.getLikedSongs()
    likedSongs.value = response
  } catch (error) {
    console.error('Error fetching liked songs:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleLike = async (trackId, isLiked) => {
  try {
    await spotify.toggleLikeTrack(trackId, isLiked)
    // Remove the track from the list
    likedSongs.value.items = likedSongs.value.items.filter(item => item.track.id !== trackId)
    likedSongs.value.total--
  } catch (error) {
    console.error('Error toggling like:', error)
  }
}

onMounted(fetchLikedSongs)
</script>

<style>
.bg-spotify-green {
  background-color: #1DB954;
}
</style> 