<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-screen p-4">
      <p class="text-red-500 mb-4">{{ error }}</p>
      <button @click="fetchAlbumData" class="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">
        Réessayer
      </button>
    </div>

    <!-- Content -->
    <div v-else class="p-8">
      <!-- Album Header -->
      <div class="flex items-end gap-6 mb-8">
        <img 
          :src="album.images[0]?.url" 
          :alt="album.name"
          class="w-48 h-48 object-cover rounded-lg shadow-lg"
        >
        <div>
          <h1 class="text-4xl font-bold mb-2">{{ album.name }}</h1>
          <div class="flex items-center gap-2 text-gray-400">
            <span>{{ album.artists.map(artist => artist.name).join(', ') }}</span>
            <span>•</span>
            <span>{{ album.release_date.split('-')[0] }}</span>
            <span>•</span>
            <span>{{ album.tracks.total }} titres</span>
          </div>
        </div>
      </div>

      <!-- Tracks -->
      <div class="space-y-2">
        <div 
          v-for="(track, index) in album.tracks.items" 
          :key="track.id"
          class="flex items-center gap-4 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
          @click="playTrack(track.uri)"
        >
          <span class="text-gray-400 w-8">{{ index + 1 }}</span>
          <div class="flex-1">
            <h3 class="font-medium">{{ track.name }}</h3>
            <p class="text-sm text-gray-400">{{ track.artists.map(a => a.name).join(', ') }}</p>
          </div>
          <span class="text-gray-400">{{ formatDuration(track.duration_ms) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSpotify } from '~/composables/useSpotify'

const route = useRoute()
const spotify = useSpotify()

const loading = ref(true)
const error = ref(null)
const album = ref(null)

const fetchAlbumData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const albumId = route.params.id
    const response = await spotify.getAlbum(albumId)
    album.value = response
  } catch (err) {
    console.error('Error fetching album data:', err)
    error.value = 'Une erreur est survenue lors du chargement des données de l\'album.'
  } finally {
    loading.value = false
  }
}

const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const playTrack = async (uri) => {
  try {
    await spotify.playTrack(uri)
  } catch (err) {
    console.error('Error playing track:', err)
  }
}

onMounted(() => {
  fetchAlbumData()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>