<template>
  <div class="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <!-- Track Info -->
      <div class="flex items-center space-x-4">
        <div class="w-14 h-14 rounded shadow-lg bg-gray-800 flex items-center justify-center">
          <img 
            v-if="currentTrack?.album?.images?.[0]?.url"
            :src="currentTrack.album.images[0].url" 
            :alt="currentTrack.name"
            class="w-full h-full object-cover rounded"
          />
          <svg v-else class="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        <div>
          <h3 class="font-medium">{{ currentTrack?.name || 'No track selected' }}</h3>
          <p class="text-sm text-gray-400">{{ currentTrack?.artists?.map(a => a.name).join(', ') || 'Unknown artist' }}</p>
          <p v-if="currentTrack" class="text-xs text-spotify-green">Click to open in Spotify</p>
        </div>
      </div>

      <!-- Player Controls -->
      <div class="flex items-center space-x-6">
        <button 
          @click="openInSpotify" 
          class="text-white hover:text-spotify-green flex items-center space-x-2"
          :disabled="!currentTrack"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <span>Open in Spotify</span>
        </button>
      </div>

      <!-- Volume Control -->
      <div class="flex items-center space-x-2">
        <button @click="toggleMute" class="text-gray-400 hover:text-white">
          <svg v-if="isMuted" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
          <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        </button>
        <input 
          type="range" 
          v-model="volume" 
          min="0" 
          max="1" 
          step="0.1"
          class="w-24"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { usePlayerStore } from '~/stores/player'

const playerStore = usePlayerStore()
const currentTrack = computed(() => playerStore.currentTrack)
const isPlaying = ref(false)
const isMuted = ref(false)
const volume = ref(1)

const loadTrack = (track) => {
  playerStore.currentTrack = track
  isPlaying.value = false
}

const openInSpotify = async () => {
  if (!currentTrack.value) return
  await playerStore.play(currentTrack.value.uri)
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
}

watch(volume, (newVolume) => {
  // Volume control is now just for show since we're not playing audio
})

defineExpose({
  loadTrack
})
</script>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  height: 4px;
  background: #4a4a4a;
  border-radius: 2px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>