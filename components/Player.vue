<template>
  <div class="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-4">
    <div class="flex items-center justify-between">
      <!-- Track Info -->
      <div class="flex items-center space-x-4">
        <img 
          v-if="currentTrack?.album?.images?.[0]?.url"
          :src="currentTrack.album.images[0].url" 
          :alt="currentTrack.name"
          class="w-14 h-14 rounded"
        />
        <div>
          <h3 class="text-white font-medium">{{ currentTrack?.name || 'Not playing' }}</h3>
          <p class="text-gray-400 text-sm">{{ currentTrack?.artists?.map(a => a.name).join(', ') }}</p>
        </div>
      </div>

      <!-- Player Controls -->
      <div class="flex flex-col items-center space-y-2">
        <div class="flex items-center space-x-6">
          <button @click="shuffle" class="text-gray-400 hover:text-white">
            <Icon name="mdi:shuffle" size="20" />
          </button>
          <button @click="previous" class="text-gray-400 hover:text-white">
            <Icon name="mdi:skip-previous" size="24" />
          </button>
          <button @click="togglePlay" class="bg-white rounded-full p-2 hover:scale-105 transition">
            <Icon :name="isPlaying ? 'mdi:pause' : 'mdi:play'" size="24" class="text-black" />
          </button>
          <button @click="next" class="text-gray-400 hover:text-white">
            <Icon name="mdi:skip-next" size="24" />
          </button>
          <button @click="toggleRepeat" class="text-gray-400 hover:text-white">
            <Icon :name="repeatIcon" size="20" />
          </button>
        </div>

        <!-- Progress Bar -->
        <div class="flex items-center space-x-2 w-full max-w-md">
          <span class="text-gray-400 text-xs">{{ formatTime(progress) }}</span>
          <div class="flex-1 h-1 bg-gray-600 rounded-full">
            <div 
              class="h-full bg-white rounded-full"
              :style="{ width: `${(progress / (currentTrack?.duration_ms || 1)) * 100}%` }"
            ></div>
          </div>
          <span class="text-gray-400 text-xs">{{ formatTime(currentTrack?.duration_ms || 0) }}</span>
        </div>
      </div>

      <!-- Volume Control -->
      <div class="flex items-center space-x-2">
        <button @click="toggleMute" class="text-gray-400 hover:text-white">
          <Icon :name="volumeIcon" size="20" />
        </button>
        <div class="w-24 h-1 bg-gray-600 rounded-full">
          <div 
            class="h-full bg-white rounded-full"
            :style="{ width: `${volume}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSpotify } from '~/composables/useSpotify'

const spotify = useSpotify()
const isPlaying = ref(false)
const currentTrack = ref(null)
const progress = ref(0)
const volume = ref(50)
const isMuted = ref(false)
const repeatMode = ref('off')

// Computed properties
const volumeIcon = computed(() => {
  if (isMuted.value || volume.value === 0) return 'mdi:volume-off'
  if (volume.value < 50) return 'mdi:volume-low'
  return 'mdi:volume-high'
})

const repeatIcon = computed(() => {
  switch (repeatMode.value) {
    case 'track': return 'mdi:repeat-once'
    case 'context': return 'mdi:repeat'
    default: return 'mdi:repeat-off'
  }
})

// Methods
const formatTime = (ms) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const togglePlay = async () => {
  try {
    if (isPlaying.value) {
      await spotify.pausePlayback()
    } else {
      await spotify.playTrack(currentTrack.value?.uri || '')
    }
    isPlaying.value = !isPlaying.value
  } catch (error) {
    console.error('Error toggling playback:', error)
  }
}

const next = async () => {
  try {
    await spotify.skipToNext()
    await updatePlaybackState()
  } catch (error) {
    console.error('Error skipping to next track:', error)
  }
}

const previous = async () => {
  try {
    await spotify.skipToPrevious()
    await updatePlaybackState()
  } catch (error) {
    console.error('Error skipping to previous track:', error)
  }
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  // Implement mute functionality
}

const toggleRepeat = () => {
  // Cycle through repeat modes
  switch (repeatMode.value) {
    case 'off': repeatMode.value = 'context'; break
    case 'context': repeatMode.value = 'track'; break
    case 'track': repeatMode.value = 'off'; break
  }
  // Implement repeat functionality
}

const shuffle = () => {
  // Implement shuffle functionality
}

// Update playback state
const updatePlaybackState = async () => {
  try {
    const state = await spotify.getPlaybackState()
    isPlaying.value = state.is_playing
    currentTrack.value = state.item
    progress.value = state.progress_ms || 0
  } catch (error) {
    console.error('Error updating playback state:', error)
  }
}

// Poll for updates
let pollInterval
onMounted(() => {
  updatePlaybackState()
  pollInterval = setInterval(updatePlaybackState, 1000)
})

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})
</script> 