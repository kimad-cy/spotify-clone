<template>
  <div class="flex h-screen bg-[#121212CC]  text-white">
    <!-- Sidebar -->
    <div class="w-64 bg-[#121212CC]  border-r border-white flex flex-col h-screen">
      <div class="p-6">
        <nav class="space-y-4">
          <NuxtLink to="/dashboard" class="flex items-center space-x-3 text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
            </svg>
            <span>Accueil</span>
          </NuxtLink>

          <NuxtLink to="/search" class="flex items-center space-x-3 text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <span>Rechercher</span>
          </NuxtLink>

          <NuxtLink to="/liked-songs" class="flex items-center space-x-3 text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>Titres likés</span>
          </NuxtLink>

          <NuxtLink to="/create-playlist" class="flex items-center space-x-3 text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-2h-2v2h-2v2h2v2h2v-2h2v-2h-2zM2 16h8v-2H2v2z"/>
            </svg>
            <span>Créer une playlist</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Playlists Section -->
      <div class="flex-1 overflow-y-auto px-6 pb-32">
        <div class="pt-4 border-t border-white">
          <h2 class="text-gray-400 text-sm font-semibold mb-4">PLAYLISTS</h2>
          <div class="space-y-2">
            <div v-for="playlist in userPlaylists.slice(0, 5)" :key="playlist.id" 
                 class="flex items-center space-x-3 text-gray-400 hover:text-white cursor-pointer group px-3 py-2 rounded hover:bg-gray-800"
                 @click="navigateToPlaylist(playlist.id)">
              <img 
                :src="playlist.images?.[0]?.url || '/default-playlist.svg'" 
                :alt="playlist.name"
                class="w-12 h-12 object-cover rounded shadow-lg"
              />
              <div class="flex-1 min-w-0">
                <p class="truncate">{{ playlist.name }}</p>
                <p class="text-xs text-gray-500 truncate">{{ playlist.tracks?.total || 0 }} titres</p>
              </div>
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
            <NuxtLink 
              to="/playlists" 
              class="flex items-center space-x-3 text-gray-400 hover:text-white px-3 py-2 rounded hover:bg-gray-800 mt-4 border-t border-gray-800 pt-4"
            >
              <div class="w-12 h-12 bg-gray-800 rounded flex items-center justify-center">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </div>
              <div>
                <p class="font-medium">Voir plus</p>
                <p class="text-xs text-gray-500">Toutes vos playlists</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="p-8 pb-64">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold mb-8">Tableau de bord</h1>
          
          <!-- Recently Played -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4">Écoutés récemment</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <div v-for="item in recentlyPlayed" :key="item.track.id" 
                  class="bg-[#0d0d0d] p-4 rounded-lg hover:bg-black transition cursor-pointer text-white"
                   @click="playTrack(item.track)">
                <img :src="item.track.album.images[0]?.url" :alt="item.track.name" 
                     class="w-full aspect-square object-cover rounded mb-4">
                <h3 class="font-semibold">{{ item.track.name }}</h3>
                <p class="text-gray-400">{{ item.track.artists.map(a => a.name).join(', ') }}</p>
              </div>
            </div>
          </section>

          <!-- Top Tracks -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4">Vos titres préférés</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <div v-for="track in topTracks" :key="track.id" 
                   class="bg-[#0d0d0d] p-4 rounded-lg hover:bg-black transition cursor-pointer text-white"
                   @click="playTrack(track)">
                <img :src="track.album.images[0]?.url" :alt="track.name" 
                     class="w-full aspect-square object-cover rounded mb-4">
                <h3 class="font-semibold">{{ track.name }}</h3>
                <p class="text-gray-400">{{ track.artists.map(a => a.name).join(', ') }}</p>
              </div>
            </div>
          </section>

          <!-- Top Artists -->
          <section>
            <h2 class="text-2xl font-bold mb-4">Vos artistes préférés</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <div v-for="artist in topArtists" :key="artist.id" 
                   class="text-center cursor-pointer"
                   @click="navigateToArtist(artist.id)">
                <img :src="artist.images[0]?.url" :alt="artist.name" 
                     class="w-full aspect-square object-cover rounded-full mb-4">
                <h3 class="font-semibold">{{ artist.name }}</h3>
                <p class="text-gray-400">Artiste</p>
              </div>
            </div>
            <NuxtLink 
              to="/artists" 
              class="inline-flex items-center space-x-2 text-gray-400 hover:text-white mt-4"
            >
              <span>Voir tous les artistes</span>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </NuxtLink>
          </section>
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

    <!-- Music Player -->
    <MusicPlayer ref="musicPlayer" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSpotify } from '~/composables/useSpotify'
import { useRouter } from 'vue-router'
import PlaylistEditor from '~/components/PlaylistEditor.vue'
import MusicPlayer from '~/components/MusicPlayer.vue'

const router = useRouter()
const spotify = useSpotify()
const recentlyPlayed = ref([])
const topTracks = ref([])
const topArtists = ref([])
const userPlaylists = ref([])
const isLoading = ref(true)
const selectedPlaylist = ref(null)
const musicPlayer = ref(null)

const playTrack = async (track) => {
  try {
    const success = await spotify.playTrack(track.uri)
    if (success && musicPlayer.value) {
      musicPlayer.value.loadTrack({
        name: track.name,
        artists: track.artists,
        album: {
          images: track.album.images
        },
        durationSeconds: track.duration_ms / 1000
      })
      musicPlayer.value.togglePlay()
    }
  } catch (error) {
    console.error('Error playing track:', error)
  }
}

const fetchDashboardData = async () => {
  try {
    isLoading.value = true
    const [recentlyPlayedData, topTracksData, topArtistsData, playlistsData] = await Promise.all([
      spotify.getRecentlyPlayed(5),
      spotify.getTopTracks('medium_term', 5),
      spotify.getTopArtists('medium_term', 5),
      spotify.getUserPlaylists()
    ])

    recentlyPlayed.value = recentlyPlayedData?.items || []
    topTracks.value = topTracksData?.items || []
    topArtists.value = topArtistsData?.items || []
    userPlaylists.value = playlistsData?.items || []
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    // Initialize with empty arrays in case of error
    recentlyPlayed.value = []
    topTracks.value = []
    topArtists.value = []
    userPlaylists.value = []
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

const logout = async () => {
  try {
    await spotify.logout()
    router.push('/login')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}

const navigateToArtist = (artistId) => {
  router.push(`/artist/${artistId}`)
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style>
.bg-spotify-green {
  background-color: #1DB954;
}
</style> 