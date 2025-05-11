<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-[#282828] rounded-lg p-6 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4">Create Playlist</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-300 mb-1">Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            class="w-full px-3 py-2 bg-[#3E3E3E] rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-spotify-green"
            placeholder="My Playlist"
            required
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea
            id="description"
            v-model="description"
            class="w-full px-3 py-2 bg-[#3E3E3E] rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-spotify-green"
            placeholder="Add an optional description"
            rows="3"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
            <span v-else>Create</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSpotify } from '~/composables/useSpotify'
import { useRouter } from 'vue-router'

const emit = defineEmits(['close', 'created'])

const spotify = useSpotify()
const router = useRouter()

const name = ref('')
const description = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  if (!spotify.user.value) return
  
  try {
    isLoading.value = true
    const playlist = await spotify.createPlaylist(
      spotify.user.value.id,
      name.value,
      { description: description.value }
    )
    
    emit('created')
    router.push(`/playlist/${playlist.id}`)
  } catch (error) {
    console.error('Error creating playlist:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
.bg-spotify-green {
  background-color: #1DB954;
}
</style>