<template>
    <NuxtLink
      :to="`/playlist/${playlist.id}`"
      class="playlist-card"
    >
      <div class="image-container">
        <img :src="playlist.images[0].url" :alt="playlist.name" class="playlist-image">
      </div>
      <h3 class="playlist-name">{{ playlist.name }}</h3>
      <p class="playlist-description">{{ playlist.description }}</p>
    </NuxtLink>
  </template>
  
  <script>
  export default {
    name: 'PlaylistCard',
    props: {
      playlist: {
        type: Object,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .playlist-card {
    @apply bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer;
  }
  .playlist-image {
    @apply w-full aspect-square object-cover rounded mb-3;
  }
  .playlist-name {
    @apply font-semibold text-white mb-1 truncate;
  }
  .playlist-description {
    @apply text-sm text-gray-400 line-clamp-2;
  }
  </style>