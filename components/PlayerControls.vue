<template>
  <div class="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <!-- Current Track Info -->
      <div class="flex items-center space-x-4 w-1/3">
        <div class="relative group">
          <img
            :src="playerStore.currentTrackImage"
            :alt="playerStore.currentTrackName"
            class="w-14 h-14 rounded shadow-lg transition-transform group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
            <button
              v-if="playerStore.currentTrack"
              @click="togglePlayback"
              class="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                v-if="!playerStore.isPlaying"
                class="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <svg
                v-else
                class="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="min-w-0">
          <h3 class="text-sm font-medium truncate hover:underline cursor-pointer" @click="openCurrentTrack">
            {{ playerStore.currentTrackName }}
          </h3>
          <p class="text-xs text-gray-400 truncate">
            <span
              v-for="(artist, index) in playerStore.currentTrack?.artists"
              :key="artist.id"
              class="hover:underline cursor-pointer"
              @click="navigateToArtist(artist.id)"
            >
              {{ artist.name }}{{ index < playerStore.currentTrack.artists.length - 1 ? ', ' : '' }}
            </span>
          </p>
        </div>
        <button
          class="text-gray-400 hover:text-white transition-colors"
          @click="toggleLike"
        >
          <svg
            class="w-5 h-5"
            :class="{ 'text-spotify-green': isLiked }"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      <!-- Player Controls -->
      <div class="flex flex-col items-center w-1/3">
        <div class="flex items-center space-x-6">
          <button
            @click="toggleShuffle"
            class="text-gray-400 hover:text-white transition-colors"
            :class="{ 'text-spotify-green': isShuffled }"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zM14.83 13.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
            </svg>
          </button>

          <button
            @click="playerStore.skipToPrevious"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button
            @click="togglePlayback"
            class="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            <svg
              v-if="!playerStore.isPlaying"
              class="w-6 h-6 text-black"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg
              v-else
              class="w-6 h-6 text-black"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </button>

          <button
            @click="playerStore.skipToNext"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>

          <button
            @click="toggleRepeat"
            class="text-gray-400 hover:text-white transition-colors"
            :class="{ 'text-spotify-green': repeatMode !== 'off' }"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
            </svg>
          </button>
        </div>

        <!-- Progress Bar -->
        <div class="w-full flex items-center space-x-2 mt-2">
          <span class="text-xs text-gray-400">{{ formatTime(progress) }}</span>
          <div class="flex-1 h-1 bg-gray-700 rounded-full group cursor-pointer">
            <div
              class="h-full bg-spotify-green rounded-full relative"
              :style="{ width: `${progressPercentage}%` }"
            >
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          <span class="text-xs text-gray-400">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- Volume Control -->
      <div class="flex items-center justify-end space-x-4 w-1/3">
        <button
          @click="toggleMute"
          class="text-gray-400 hover:text-white transition-colors"
        >
          <svg
            v-if="volume > 0"
            class="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
          <svg
            v-else
            class="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        </button>

        <div class="w-24 flex items-center space-x-2">
          <input
            type="range"
            v-model="volume"
            min="0"
            max="100"
            class="w-full"
            @input="updateVolume"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '~/stores/player'
import { useRouter } from '#imports'

const router = useRouter()
const playerStore = usePlayerStore()
const progress = ref(0)
const duration = ref(0)
const volume = ref(50)
const previousVolume = ref(50)
const progressInterval = ref(null)
const isLiked = ref(false)
const isShuffled = ref(false)
const repeatMode = ref('off')

const progressPercentage = computed(() => {
  if (!duration.value) return 0
  return (progress.value / duration.value) * 100
})

const formatTime = (ms) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const togglePlayback = async () => {
  if (playerStore.isPlaying) {
    await playerStore.pause()
  } else {
    await playerStore.resume()
  }
}

const toggleMute = () => {
  if (volume.value > 0) {
    previousVolume.value = volume.value
    volume.value = 0
  } else {
    volume.value = previousVolume.value
  }
  updateVolume()
}

const updateVolume = async () => {
  await playerStore.setVolume(volume.value)
}

const updateProgress = async () => {
  try {
    const state = await playerStore.spotify.getPlaybackState()
    if (state) {
      progress.value = state.progress_ms ?? 0
      duration.value = state.item?.duration_ms ?? 0
    }
  } catch (error) {
    console.error('Error updating progress:', error)
  }
}

const toggleShuffle = async () => {
  try {
    await playerStore.spotify.setShuffle(!isShuffled.value)
    isShuffled.value = !isShuffled.value
  } catch (error) {
    console.error('Error toggling shuffle:', error)
  }
}

const toggleRepeat = async () => {
  try {
    let newMode
    switch (repeatMode.value) {
      case 'off':
        newMode = 'context'
        break
      case 'context':
        newMode = 'track'
        break
      case 'track':
        newMode = 'off'
        break
    }
    await playerStore.spotify.setRepeatMode(newMode)
    repeatMode.value = newMode
  } catch (error) {
    console.error('Error toggling repeat:', error)
  }
}

const toggleLike = async () => {
  try {
    if (isLiked.value) {
      await playerStore.spotify.removeFromSavedTracks([playerStore.currentTrack.id])
    } else {
      await playerStore.spotify.addToSavedTracks([playerStore.currentTrack.id])
    }
    isLiked.value = !isLiked.value
  } catch (error) {
    console.error('Error toggling like:', error)
  }
}

const openCurrentTrack = () => {
  if (playerStore.currentTrack) {
    router.push(`/track/${playerStore.currentTrack.id}`)
  }
}

const navigateToArtist = (artistId) => {
  router.push(`/artist/${artistId}`)
}

onMounted(() => {
  updateProgress()
  progressInterval.value = setInterval(updateProgress, 1000)
})

onUnmounted(() => {
  if (progressInterval.value) {
    clearInterval(progressInterval.value)
  }
})
</script>

<style>
.bg-spotify-green {
  background-color: #1DB954;
}

input[type="range"] {
  -webkit-appearance: none;
  background: #4B5563;
  border-radius: 5px;
  height: 4px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  height: 12px;
  width: 12px;
}

input[type="range"]::-moz-range-thumb {
  background: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  height: 12px;
  width: 12px;
}
</style>
