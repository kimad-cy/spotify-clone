<template>
  <nav class="bg-black h-full w-64 p-6 flex flex-col">
    <!-- Logo -->
    <div class="mb-8">
      <img src="/spotify-logo.png" alt="Spotify" class="h-10" />
    </div>

    <!-- Main Navigation -->
    <div class="space-y-2">
      <NuxtLink
        to="/"
        class="flex items-center space-x-4 text-gray-400 hover:text-white transition-colors"
        :class="{ 'text-white': $route.path === '/' }"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
        <span>Home</span>
      </NuxtLink>

      <NuxtLink
        to="/search"
        class="flex items-center space-x-4 text-gray-400 hover:text-white transition-colors"
        :class="{ 'text-white': $route.path === '/search' }"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        <span>Search</span>
      </NuxtLink>

      <NuxtLink
        to="/library"
        class="flex items-center space-x-4 text-gray-400 hover:text-white transition-colors"
        :class="{ 'text-white': $route.path === '/library' }"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4z" />
        </svg>
        <span>Your Library</span>
      </NuxtLink>
    </div>

    <!-- Create Playlist -->
    <div class="mt-8">
      <button
        @click="showPlaylistCreator = true"
        class="flex items-center space-x-4 text-gray-400 hover:text-white transition-colors"
      >
        <div class="w-6 h-6 bg-gray-400 hover:bg-white transition-colors flex items-center justify-center rounded-sm">
          <svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </div>
        <span>Create Playlist</span>
      </button>
    </div>

    <!-- Liked Songs -->
    <div class="mt-4">
      <NuxtLink
        to="/collection/tracks"
        class="flex items-center space-x-4 text-gray-400 hover:text-white transition-colors"
        :class="{ 'text-white': $route.path === '/collection/tracks' }"
      >
        <div class="w-6 h-6 bg-gradient-to-br from-purple-700 to-blue-300 flex items-center justify-center rounded-sm">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <span>Liked Songs</span>
      </NuxtLink>
    </div>

    <!-- Divider -->
    <div class="border-t border-gray-800 my-4"></div>

    <!-- User Playlists -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="isLoading" class="flex justify-center py-4">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-spotify-green"></div>
      </div>
      <div v-else-if="playlists.length === 0" class="text-gray-400 text-sm py-4">
        No playlists found
      </div>
      <div v-else class="space-y-2">
        <NuxtLink
          v-for="playlist in playlists"
          :key="playlist.id"
          :to="`/playlist/${playlist.id}`"
          class="block text-gray-400 hover:text-white transition-colors truncate"
          :class="{ 'text-white': $route.params.id === playlist.id }"
        >
          {{ playlist.name }}
        </NuxtLink>
      </div>
    </div>

    <!-- Playlist Creator Modal -->
    <PlaylistCreator
      v-if="showPlaylistCreator"
      @close="showPlaylistCreator = false"
      @created="handlePlaylistCreated"
    />
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSpotify } from '~/composables/useSpotify'

const spotify = useSpotify()
const playlists = ref([])
const isLoading = ref(true)
const showPlaylistCreator = ref(false)

const fetchPlaylists = async () => {
  try {
    const response = await spotify.getUserPlaylists()
    playlists.value = response
  } catch (error) {
    console.error('Error fetching playlists:', error)
  } finally {
    isLoading.value = false
  }
}

const handlePlaylistCreated = async () => {
  showPlaylistCreator.value = false
  await fetchPlaylists()
}

onMounted(fetchPlaylists)
</script>

<style>
.bg-spotify-green {
  background-color: #1DB954;
}
</style> 