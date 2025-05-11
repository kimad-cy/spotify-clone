<template>
  <div class="p-8">
    <div class="flex items-center space-x-4 mb-8">
      <div class="w-48 h-48 bg-gradient-to-br from-purple-700 to-blue-300 rounded-md flex items-center justify-center">
        <svg class="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
      <div>
        <h1 class="text-4xl font-bold mb-2">Liked Songs</h1>
        <p class="text-gray-400">{{ totalTracks }} songs</p>
      </div>
    </div>

    <!-- Play Button -->
    <div class="mb-8">
      <button
        @click="playAll"
        class="bg-spotify-green text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform"
        :disabled="isLoading || tracks.length === 0"
      >
        <span v-if="isLoading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
        <span v-else>Play</span>
      </button>
    </div>

    <!-- Tracks List -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-spotify-green"></div>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <div v-else-if="tracks.length === 0" class="text-center py-8">
      <h3 class="text-xl font-bold mb-2">No liked songs yet</h3>
      <p class="text-gray-400">Start liking songs to see them here</p>
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="(track, index) in tracks"
        :key="track.id"
        class="flex items-center space-x-4 p-2 rounded hover:bg-[#282828] group"
      >
        <div class="w-8 text-center text-gray-400 group-hover:text-white">
          {{ index + 1 }}
        </div>
        <div class="flex-1 flex items-center space-x-4">
          <div class="w-12 h-12 bg-[#333] rounded overflow-hidden">
            <img
              v-if="track.album?.images?.[0]?.url"
              :src="track.album.images[0].url"
              :alt="track.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 class="font-medium truncate">{{ track.name }}</h3>
            <p class="text-sm text-gray-400 truncate">
              {{ track.artists.map(a => a.name).join(', ') }}
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <button
            @click="playTrack(track)"
            class="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <button
            @click="removeFromLiked(track.id)"
            class="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSpotify } from '~/composables/useSpotify'

const spotify = useSpotify()
const tracks = ref([])
const isLoading = ref(true)
const error = ref(null)

const totalTracks = computed(() => tracks.value.length)

const fetchLikedTracks = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await spotify.getSavedTracks()
    tracks.value = response.items.map(item => item.track)
  } catch (err) {
    error.value = 'Failed to load liked songs. Please try again.'
    console.error('Error fetching liked tracks:', err)
  } finally {
    isLoading.value = false
  }
}

const playTrack = async (track) => {
  try {
    await spotify.playTrack(track.uri)
  } catch (err) {
    console.error('Error playing track:', err)
  }
}

const playAll = async () => {
  if (tracks.value.length === 0) return

  try {
    const uris = tracks.value.map(track => track.uri)
    await spotify.playTracks(uris)
  } catch (err) {
    console.error('Error playing tracks:', err)
  }
}

const removeFromLiked = async (trackId) => {
  try {
    await spotify.removeFromSavedTracks([trackId])
    tracks.value = tracks.value.filter(track => track.id !== trackId)
  } catch (err) {
    console.error('Error removing track from liked songs:', err)
  }
}

onMounted(fetchLikedTracks)
</script>

<style>
.bg-spotify-green {
  background-color: #1DB954;
}
</style> 