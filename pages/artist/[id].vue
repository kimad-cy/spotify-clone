<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-screen p-4">
      <p class="text-red-500 mb-4">{{ error }}</p>
      <button @click="fetchArtistData" class="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">
        Réessayer
      </button>
    </div>

    <!-- Content -->
    <div v-else class="p-8">
      <!-- Artist Header -->
      <div class="flex items-end gap-6 mb-8">
        <img 
          :src="artist.images[0]?.url" 
          :alt="artist.name"
          class="w-48 h-48 object-cover rounded-lg shadow-lg"
        >
        <div>
          <h1 class="text-4xl font-bold mb-2">{{ artist.name }}</h1>
          <p class="text-gray-400">{{ formatNumber(artist.followers.total) }} abonnés</p>
        </div>
      </div>

      <!-- Top Tracks -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">Titres populaires</h2>
        <div class="space-y-2">
          <div 
            v-for="(track, index) in topTracks" 
            :key="track.id"
            class="flex items-center gap-4 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
            @click="playTrack(track.uri)"
          >
            <span class="text-gray-400 w-8">{{ index + 1 }}</span>
            <img 
              :src="track.album.images[0]?.url" 
              :alt="track.name"
              class="w-12 h-12 object-cover rounded"
            >
            <div class="flex-1">
              <h3 class="font-medium">{{ track.name }}</h3>
              <p class="text-sm text-gray-400">{{ track.artists.map(a => a.name).join(', ') }}</p>
            </div>
            <span class="text-gray-400">{{ formatDuration(track.duration_ms) }}</span>
          </div>
        </div>
      </div>

      <!-- Albums -->
      <div>
        <h2 class="text-2xl font-bold mb-4">Albums</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div 
            v-for="album in albums" 
            :key="album.id"
            class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer"
            @click="navigateToAlbum(album.id)"
          >
            <img 
              :src="album.images[0]?.url" 
              :alt="album.name"
              class="w-full aspect-square object-cover rounded-lg mb-4"
            >
            <h3 class="font-medium truncate">{{ album.name }}</h3>
            <p class="text-sm text-gray-400">{{ album.release_date.split('-')[0] }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSpotify } from '~/composables/useSpotify'

const route = useRoute()
const router = useRouter()
const spotify = useSpotify()

const loading = ref(true)
const error = ref(null)
const artist = ref(null)
const topTracks = ref([])
const albums = ref([])

const fetchArtistData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const artistId = route.params.id
    const [artistData, topTracksData, albumsData] = await Promise.all([
      spotify.getArtist(artistId),
      spotify.getArtistTopTracks(artistId),
      spotify.getArtistAlbums(artistId)
    ])
    
    artist.value = artistData
    topTracks.value = topTracksData.tracks
    albums.value = albumsData.items
  } catch (err) {
    console.error('Error fetching artist data:', err)
    error.value = 'Une erreur est survenue lors du chargement des données de l\'artiste.'
  } finally {
    loading.value = false
  }
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num)
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

const navigateToAlbum = (albumId) => {
  router.push(`/album/${albumId}`)
}

onMounted(() => {
  fetchArtistData()
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