<template>
  <div class="w-full p-4 rounded-lg ">
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher des titres..."
        class="w-full border-green-500 bg-[#0d0d0d] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        @input="debounceSearch"
      >
      <div v-if="isLoading" class="absolute right-3 top-3">
        <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-green-500"></div>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="searchResults.length > 0" class="mt-4 space-y-2 max-h-96 overflow-y-auto bg-[#0d0d0d] rounded-lg p-2">
      <div 
        v-for="track in searchResults" 
        :key="track.id"
        class="flex items-center gap-4 p-3 hover:bg-black rounded-lg cursor-pointer transition-colors"
        @click="$emit('track-selected', track)"
      >
        <img 
          :src="track.album?.images[0]?.url || '/default-playlist.svg'" 
          :alt="track.name"
          class="w-12 h-12 object-cover rounded"
        >
        <div class="flex-1">
          <h3 class="font-medium text-white">{{ track.name }}</h3>
          <p class="text-sm text-gray-400">{{ track.artists?.map(a => a.name).join(', ') }}</p>
        </div>
        <span class="text-gray-400">{{ formatDuration(track.duration_ms) }}</span>
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="searchQuery && !isLoading" class="mt-4 text-center text-gray-400 bg-gray-800 rounded-lg p-4">
      Aucun résultat trouvé
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useSpotify } from '~/composables/useSpotify'

const spotify = useSpotify()
const searchQuery = ref('')
const searchResults = ref([])
const isLoading = ref(false)
let searchTimeout = null

const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const searchTracks = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  try {
    isLoading.value = true
    const response = await spotify.search(searchQuery.value, ['track'], 10)
    searchResults.value = response.tracks.items
  } catch (err) {
    console.error('Error searching tracks:', err)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}

const debounceSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(searchTracks, 300)
}

// Clear results when search query is empty
watch(searchQuery, (newValue) => {
  if (!newValue.trim()) {
    searchResults.value = []
  }
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
