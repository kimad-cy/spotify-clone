<template>
    <div class="track-list bg-gray-800 bg-opacity-40 rounded-lg">
      <div 
        v-for="(track, index) in tracks"
        :key="track.id"
        class="track-item"
        @click="playTrack(track.uri)"
      >
        <div class="track-number">{{ index + 1 }}</div>
        <div class="track-info">
          <img 
            :src="track.album.images[0].url" 
            :alt="track.name"
            class="track-image"
          >
          <div>
            <p class="track-name">{{ track.name }}</p>
            <p class="track-artist">{{ track.artists[0].name }}</p>
          </div>
        </div>
        <div class="track-duration">{{ formatDuration(track.duration_ms) }}</div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    tracks: {
      type: Array,
      required: true
    }
  })

  const emit = defineEmits(['play'])

  const playTrack = (uri) => {
    emit('play', uri)
  }

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = ((ms % 60000) / 1000).toFixed(0)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
  </script>
  
  <style scoped>
  .track-list {
    @apply divide-y divide-gray-700;
  }
  .track-item {
    @apply flex items-center p-3 hover:bg-gray-700 cursor-pointer;
  }
  .track-number {
    @apply w-8 text-gray-400 text-center;
  }
  .track-info {
    @apply flex items-center flex-1;
  }
  .track-image {
    @apply w-10 h-10 mr-3;
  }
  .track-name {
    @apply text-white font-medium;
  }
  .track-artist {
    @apply text-gray-400 text-sm;
  }
  .track-duration {
    @apply text-gray-400 text-sm;
  }
  </style>