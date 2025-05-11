<!-- pages/search.vue -->
<template>
  <div class="p-6 bg-[#121212] min-h-screen">
    <div class="mb-6">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Que voulez-vous écouter ?" 
        class="w-full max-w-2xl px-4 py-2 rounded-full bg-[#242424] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-spotify-green"
        @input="handleSearch"
      >
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
    </div>

    <div v-else-if="searchResults">
      <!-- Tabs -->
      <div class="flex space-x-4 mb-6">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition',
            activeTab === tab.id 
              ? 'bg-white text-black' 
              : 'text-gray-400 hover:text-white'
          ]"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Results -->
      <div v-if="activeTab === 'tracks'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="track in searchResults.tracks?.items" :key="track.id" 
             class="bg-[#181818] p-3 rounded-lg hover:bg-[#282828] transition cursor-pointer">
          <div class="flex items-center space-x-3">
            <img :src="track.album.images[0]?.url" :alt="track.name" 
                 class="w-12 h-12 object-cover rounded">
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-sm truncate">{{ track.name }}</h3>
              <p class="text-gray-400 text-xs truncate">{{ track.artists.map(a => a.name).join(', ') }}</p>
            </div>
            <button @click.stop="toggleLike(track.id, track.isLiked)" 
                    class="text-gray-400 hover:text-white">
              <svg v-if="track.isLiked" class="w-5 h-5 text-spotify-green" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'artists'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div v-for="artist in searchResults.artists?.items" :key="artist.id" 
             class="text-center">
          <div class="relative group">
            <img :src="artist.images[0]?.url" :alt="artist.name" 
                 class="w-full aspect-square object-cover rounded-full mb-2">
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition rounded-full flex items-center justify-center">
              <button class="opacity-0 group-hover:opacity-100 bg-spotify-green text-black p-2 rounded-full">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>
          <h3 class="font-medium text-sm truncate">{{ artist.name }}</h3>
          <p class="text-gray-400 text-xs">Artiste</p>
        </div>
      </div>

      <div v-else-if="activeTab === 'albums'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div v-for="album in searchResults.albums?.items" :key="album.id" 
             class="bg-[#181818] p-3 rounded-lg hover:bg-[#282828] transition cursor-pointer">
          <img :src="album.images[0]?.url" :alt="album.name" 
               class="w-full aspect-square object-cover rounded-md mb-2">
          <h3 class="font-medium text-sm truncate">{{ album.name }}</h3>
          <p class="text-gray-400 text-xs truncate">{{ album.artists.map(a => a.name).join(', ') }}</p>
        </div>
      </div>

      <div v-else-if="activeTab === 'playlists'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div v-for="playlist in searchResults.playlists?.items" :key="playlist.id" 
             class="bg-[#181818] p-3 rounded-lg hover:bg-[#282828] transition cursor-pointer">
          <img :src="playlist.images[0]?.url" :alt="playlist.name" 
               class="w-full aspect-square object-cover rounded-md mb-2">
          <h3 class="font-medium text-sm truncate">{{ playlist.name }}</h3>
          <p class="text-gray-400 text-xs truncate">{{ playlist.owner.display_name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useSpotify } from '~/composables/useSpotify'
import { useDebounce } from '~/composables/useDebounce'

const spotify = useSpotify()
const searchQuery = ref('')
const searchResults = ref(null)
const isLoading = ref(false)
const activeTab = ref('tracks')

const tabs = [
  { id: 'tracks', name: 'Titres' },
  { id: 'artists', name: 'Artistes' },
  { id: 'albums', name: 'Albums' },
  { id: 'playlists', name: 'Playlists' }
]

const debouncedSearch = useDebounce(async (query) => {
  if (!query) {
    searchResults.value = null
    return
  }

  isLoading.value = true
  try {
    const results = await spotify.search(query)
    searchResults.value = results
  } catch (error) {
    console.error('Error searching:', error)
  } finally {
    isLoading.value = false
  }
}, 300)

const handleSearch = () => {
  debouncedSearch(searchQuery.value)
}

const toggleLike = async (trackId, isLiked) => {
  try {
    await spotify.toggleLikeTrack(trackId, isLiked)
    // Update the UI
    const track = searchResults.value.tracks.items.find(t => t.id === trackId)
    if (track) {
      track.isLiked = !isLiked
    }
  } catch (error) {
    console.error('Error toggling like:', error)
  }
}
</script>

<style>
.bg-spotify-green {
  background-color: #1DB954;
}
</style>