<template>
  <div class="min-h-screen bg-black text-white p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Vos Playlists</h1>
      
      <div v-if="isLoading" class="flex items-center justify-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      </div>

      <div v-else-if="error" class="text-center">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <button 
          @click="fetchPlaylists" 
          class="bg-spotify-green hover:bg-opacity-90 text-black font-bold py-2 px-4 rounded-full"
        >
          Réessayer
        </button>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div v-for="playlist in playlists" :key="playlist.id" 
             class="bg-[#0d0d0d] p-4 rounded-lg hover:bg-[#0d0d0d] transition cursor-pointer group"
             @click="navigateToPlaylist(playlist.id)">
          <img 
            :src="playlist.images?.[0]?.url || '/default-playlist.svg'" 
            :alt="playlist.name"
            class="w-full aspect-square object-cover rounded mb-4 shadow-lg"
          />
          <h3 class="font-semibold truncate">{{ playlist.name }}</h3>
          <p class="text-gray-400 text-sm">{{ playlist.tracks?.total || 0 }} titres</p>
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              @click.stop="showEditModal(playlist)" 
              class="text-white hover:text-spotify-green"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Playlist Modal -->
    <PlaylistEditor 
      v-if="selectedPlaylist"
      :playlist="selectedPlaylist"
      @playlist-updated="fetchPlaylists"
      @close="selectedPlaylist = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSpotify } from '~/composables/useSpotify'
import PlaylistEditor from '~/components/PlaylistEditor.vue'

const router = useRouter()
const spotify = useSpotify()
const playlists = ref([])
const isLoading = ref(true)
const error = ref(null)
const selectedPlaylist = ref(null)

const fetchPlaylists = async () => {
  try {
    isLoading.value = true
    error.value = null
    const data = await spotify.getUserPlaylists()
    playlists.value = data?.items || []
  } catch (err) {
    console.error('Error fetching playlists:', err)
    error.value = 'Impossible de charger les playlists. Veuillez réessayer.'
  } finally {
    isLoading.value = false
  }
}

const navigateToPlaylist = (playlistId) => {
  router.push(`/playlist/${playlistId}`)
}

const showEditModal = (playlist) => {
  selectedPlaylist.value = playlist
}

onMounted(fetchPlaylists)
</script>

<style>
.bg-spotify-green {
  background-color: #1DB954;
}
</style> 