<!-- components/SearchResultItem.vue -->
<template>
    <div
      @click="handleClick"
      class="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer"
    >
      <div class="flex-shrink-0 mr-3">
        <img
          :src="imageUrl"
          :alt="item.name"
          class="w-10 h-10 object-cover rounded"
        >
      </div>
      <div class="min-w-0">
        <p class="text-sm font-medium truncate">{{ item.name }}</p>
        <p class="text-xs text-gray-400 truncate">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      item: {
        type: Object,
        required: true
      },
      type: {
        type: String,
        required: true
      }
    },
    computed: {
      imageUrl() {
        if (this.type === 'artist') {
          return this.item.images[0]?.url || 'https://via.placeholder.com/50';
        }
        return this.item.album?.images[0]?.url || this.item.images[0]?.url || 'https://via.placeholder.com/50';
      },
      subtitle() {
        switch (this.type) {
          case 'track':
            return this.item.artists.map(a => a.name).join(', ');
          case 'artist':
            return 'Artist';
          case 'album':
            return `${this.item.artists.map(a => a.name).join(', ')} • ${this.item.release_date?.substring(0, 4)}`;
          case 'playlist':
            return `By ${this.item.owner.display_name}`;
          default:
            return '';
        }
      }
    },
    methods: {
      handleClick() {
        this.$emit('select', this.item);
      }
    }
  };
  </script>