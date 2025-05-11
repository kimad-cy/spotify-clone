<template>
  <div class="min-h-screen bg-black text-white p-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-screen p-4">
      <p class="text-red-500 mb-4">{{ error }}</p>
      <button @click="fetchArtists" class="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">
        Réessayer
      </button>
    </div>

    <!-- Content -->
    <div v-else>
      <h1 class="text-3xl font-bold mb-8">Artistes suivis</h1>
      
      <div v-if="artists.length === 0" class="text-center text-gray-400">
        Vous ne suivez aucun artiste pour le moment.
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div 
          v-for="artist in artists" 
          :key="artist.id"
          class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer"
          @click="navigateToArtist(artist.id)"
        >
          <img 
            :src="artist.images[0]?.url" 
            :alt="artist.name"
            class="w-full aspect-square object-cover rounded-full mb-4"
          >
          <h3 class="font-medium truncate text-center">{{ artist.name }}</h3>
          <p class="text-sm text-gray-400 text-center">Artiste</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSpotify } from '~/composables/useSpotify'

const router = useRouter()
const spotify = useSpotify()

const loading = ref(true)
const error = ref(null)
const artists = ref([])

const fetchArtists = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await spotify.getFollowedArtists()
    artists.value = response.items
  } catch (err) {
    console.error('Error fetching artists:', err)
    error.value = 'Une erreur est survenue lors du chargement des artistes.'
  } finally {
    loading.value = false
  }
}

const navigateToArtist = (artistId) => {
  router.push(`/artist/${artistId}`)
}

onMounted(() => {
  fetchArtists()
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