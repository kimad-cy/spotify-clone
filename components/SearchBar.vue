<!-- components/SearchBar.vue -->
<template>
  <div class="relative">
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="What do you want to listen to?"
        class="w-full bg-gray-800 text-white px-4 py-3 rounded-lg pl-12 focus:outline-none focus:ring-2 focus:ring-spotify-green"
        @input="handleSearch"
      />
      <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <div v-if="isLoading" class="absolute right-4 top-1/2 transform -translate-y-1/2">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-spotify-green"></div>
      </div>
    </div>

    <!-- Search Results Dropdown -->
    <div
      v-if="showResults && searchResults"
      class="absolute z-50 w-full mt-2 bg-gray-900 rounded-lg shadow-lg max-h-96 overflow-y-auto"
    >
      <!-- Tracks -->
      <div v-if="searchResults.tracks?.items?.length" class="p-4">
        <h3 class="text-sm font-semibold text-gray-400 mb-2">Songs</h3>
        <div class="space-y-2">
          <div
            v-for="track in searchResults.tracks.items"
            :key="track.id"
            class="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
            @click="playTrack(track)"
          >
            <img
              :src="track.album.images[0]?.url"
              :alt="track.name"
              class="w-10 h-10 rounded"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ track.name }}</p>
              <p class="text-xs text-gray-400 truncate">
                {{ track.artists.map(artist => artist.name).join(', ') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Artists -->
      <div v-if="searchResults.artists?.items?.length" class="p-4 border-t border-gray-800">
        <h3 class="text-sm font-semibold text-gray-400 mb-2">Artists</h3>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="artist in searchResults.artists.items"
            :key="artist.id"
            class="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
            @click="navigateToArtist(artist.id)"
          >
            <img
              :src="artist.images[0]?.url"
              :alt="artist.name"
              class="w-10 h-10 rounded-full"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ artist.name }}</p>
              <p class="text-xs text-gray-400">Artist</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Albums -->
      <div v-if="searchResults.albums?.items?.length" class="p-4 border-t border-gray-800">
        <h3 class="text-sm font-semibold text-gray-400 mb-2">Albums</h3>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="album in searchResults.albums.items"
            :key="album.id"
            class="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
            @click="navigateToAlbum(album.id)"
          >
            <img
              :src="album.images[0]?.url"
              :alt="album.name"
              class="w-10 h-10 rounded"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ album.name }}</p>
              <p class="text-xs text-gray-400 truncate">
                {{ album.artists.map(artist => artist.name).join(', ') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Playlists -->
      <div v-if="searchResults.playlists?.items?.length" class="p-4 border-t border-gray-800">
        <h3 class="text-sm font-semibold text-gray-400 mb-2">Playlists</h3>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="playlist in searchResults.playlists.items"
            :key="playlist.id"
            class="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
            @click="navigateToPlaylist(playlist.id)"
          >
            <img
              :src="playlist.images[0]?.url"
              :alt="playlist.name"
              class="w-10 h-10 rounded"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ playlist.name }}</p>
              <p class="text-xs text-gray-400 truncate">
                By {{ playlist.owner.display_name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useSpotify } from '~/composables/useSpotify'
import { useRouter } from '#imports'
import { debounce } from 'lodash-es'

const router = useRouter()
const spotify = useSpotify()

const searchQuery = ref('')
const searchResults = ref(null)
const isLoading = ref(false)
const showResults = ref(false)

const handleSearch = debounce(async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = null
    showResults.value = false
    return
  }

  isLoading.value = true
  try {
    const results = await spotify.search(searchQuery.value)
    searchResults.value = results
    showResults.value = true
  } catch (error) {
    console.error('Error searching:', error)
  } finally {
    isLoading.value = false
  }
}, 300)

const playTrack = async (track) => {
  try {
    await spotify.playTrack(track.uri)
    showResults.value = false
  } catch (error) {
    console.error('Error playing track:', error)
  }
}

const navigateToArtist = (id) => {
  router.push(`/artist/${id}`)
  showResults.value = false
}

const navigateToAlbum = (id) => {
  router.push(`/album/${id}`)
  showResults.value = false
}

const navigateToPlaylist = (id) => {
  router.push(`/playlist/${id}`)
  showResults.value = false
}

// Close results when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.search-bar')) {
    showResults.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style>
.bg-spotify-green {
  background-color: #1DB954;
}
</style>