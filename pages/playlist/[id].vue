<template>
  <div class="p-8">
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-spotify-green"></div>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <div v-else-if="playlist" class="space-y-8">
      <!-- Playlist Header -->
      <div class="flex items-end space-x-6">
        <div class="w-48 h-48 bg-gray-800 rounded-lg shadow-2xl flex items-center justify-center">
          <img 
            v-if="playlist.images && playlist.images.length > 0"
            :src="playlist.images[0].url" 
            :alt="playlist.name"
            class="w-full h-full object-cover rounded-lg"
          />
          <svg 
            v-else
            class="w-24 h-24 text-gray-600" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-4xl font-bold mb-2">{{ playlist.name }}</h1>
          <p class="text-gray-400">{{ playlist.description || 'Aucune description' }}</p>
          <div class="mt-4 flex items-center space-x-4">
            <span class="text-sm text-gray-400">{{ playlist.owner.display_name }}</span>
            <span class="text-sm text-gray-400">{{ playlist.tracks.total }} titres</span>
          </div>
        </div>
      </div>
      
      <!-- Add Tracks Section -->
      <div class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-4">Ajouter des titres</h2>
        <SearchTracks @track-selected="addTrack" />
      </div>
      
      <!-- Playlist Tracks -->
      <div class="bg-gray-800 rounded-lg overflow-hidden">
        <div class="p-4 border-b border-gray-700">
          <div class="grid grid-cols-[50px_1fr_1fr_1fr] gap-4 text-gray-400 text-sm">
            <div>#</div>
            <div>Titre</div>
            <div>Album</div>
            <div>Durée</div>
          </div>
        </div>
        <div class="pb-32">
          <div 
            v-for="(item, index) in playlist.tracks.items" 
            :key="item.track.id"
            class="grid grid-cols-[50px_1fr_1fr_1fr] gap-4 p-4 hover:bg-gray-700 transition cursor-pointer"
            @click="playTrack(item.track.uri)"
          >
            <div class="text-gray-400">{{ index + 1 }}</div>
            <div class="flex items-center space-x-4">
              <img 
                :src="item.track.album.images[0]?.url" 
                :alt="item.track.name"
                class="w-10 h-10 object-cover"
              />
              <div>
                <div class="font-medium">{{ item.track.name }}</div>
                <div class="text-sm text-gray-400">{{ item.track.artists.map(a => a.name).join(', ') }}</div>
              </div>
            </div>
            <div class="text-gray-400">{{ item.track.album.name }}</div>
            <div class="flex items-center justify-between">
              <span class="text-gray-400">{{ formatDuration(item.track.duration_ms) }}</span>
              <button 
                @click.stop="removeTrack(item.track)"
                class="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-gray-600 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 13H5v-2h14v2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSpotify } from '~/composables/useSpotify'
import SearchTracks from '~/components/SearchTracks.vue'

const route = useRoute()
const spotify = useSpotify()
const playlist = ref(null)
const isLoading = ref(true)
const error = ref(null)

const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const fetchPlaylist = async () => {
  try {
    const playlistId = route.params.id
    const data = await spotify.getPlaylist(playlistId)
    playlist.value = data
  } catch (err) {
    console.error('Error fetching playlist:', err)
    error.value = 'Une erreur est survenue lors du chargement de la playlist'
  } finally {
    isLoading.value = false
  }
}

const playTrack = async (uri) => {
  try {
    await spotify.playTrack(uri)
  } catch (err) {
    console.error('Error playing track:', err)
    error.value = 'Une erreur est survenue lors de la lecture du titre'
  }
}

const addTrack = async (track) => {
  try {
    error.value = null
    const trackUri = track.uri || `spotify:track:${track.id}`
    await spotify.addTracksToPlaylist(playlist.value.id, [trackUri])
    await fetchPlaylist()
  } catch (err) {
    console.error('Error adding track:', err)
    error.value = 'Une erreur est survenue lors de l\'ajout du titre'
  }
}

const removeTrack = async (track) => {
  if (!confirm('Voulez-vous vraiment supprimer ce titre de la playlist ?')) return

  try {
    error.value = null
    await spotify.removeTracksFromPlaylist(playlist.value.id, [track.uri])
    await fetchPlaylist()
  } catch (err) {
    console.error('Error removing track:', err)
    error.value = 'Une erreur est survenue lors de la suppression du titre'
  }
}

onMounted(() => {
  fetchPlaylist()
})
</script>

<style>
.bg-spotify-green {
  background-color: #1DB954;
}
</style>