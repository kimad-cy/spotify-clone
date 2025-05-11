<!-- components/SearchCard.vue -->
<template>
    <div
      @click="$emit('click')"
      class="bg-gray-800 p-4 rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
    >
      <div class="relative mb-4">
        <img
          :src="imageUrl"
          :alt="item.name"
          class="w-full aspect-square object-cover rounded shadow-lg"
        >
        <button
          v-if="type === 'track'"
          class="absolute bottom-2 right-2 bg-green-500 rounded-full p-2 hover:bg-green-400 transition-colors"
          @click.stop="$emit('play', item.uri)"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"></path>
          </svg>
        </button>
      </div>
      <h3 class="font-semibold truncate">{{ item.name }}</h3>
      <p class="text-sm text-gray-400 truncate">{{ subtitle }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      item: Object,
      type: String
    },
    computed: {
      imageUrl() {
        if (this.type === 'artist') {
          return this.item.images[0]?.url || 'https://via.placeholder.com/300';
        }
        return this.item.album?.images[0]?.url || this.item.images[0]?.url || 'https://via.placeholder.com/300';
      },
      subtitle() {
        switch (this.type) {
          case 'track':
            return this.item.artists.map(a => a.name).join(', ');
          case 'artist':
            return 'Artist';
          case 'album':
            return this.item.artists.map(a => a.name).join(', ');
          case 'playlist':
            return `By ${this.item.owner.display_name}`;
          default:
            return '';
        }
      }
    }
  };
  </script>