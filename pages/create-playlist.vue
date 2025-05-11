<template>
  <div class="p-6 bg-[#121212] min-h-screen">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Créer une playlist</h1>

      <form @submit.prevent="createPlaylist" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-400 mb-2">Nom</label>
          <input 
            id="name"
            v-model="name"
            type="text"
            required
            class="w-full px-4 py-2 rounded bg-[#242424] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-spotify-green"
            placeholder="Ma playlist"
          >
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-400 mb-2">Description</label>
          <textarea 
            id="description"
            v-model="description"
            rows="3"
            class="w-full px-4 py-2 rounded bg-[#242424] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-spotify-green"
            placeholder="Ajoutez une description optionnelle"
          ></textarea>
        </div>

        <div class="flex items-center">
          <input 
            id="public"
            v-model="isPublic"
            type="checkbox"
            class="h-4 w-4 text-spotify-green focus:ring-spotify-green border-gray-600 rounded"
          >
          <label for="public" class="ml-2 block text-sm text-gray-400">
            Rendre publique
          </label>
        </div>

        <div class="flex justify-end">
          <button 
            type="submit"
            :disabled="isLoading"
            class="px-6 py-2 bg-spotify-green text-black font-medium rounded-full hover:bg-opacity-80 transition disabled:opacity-50"
          >
            <span v-if="isLoading">Création en cours...</span>
            <span v-else>Créer</span>
          </button>
        </div>
      </form>

      <div v-if="error" class="mt-4 p-4 bg-red-900/50 text-red-200 rounded">
        {{ error }}
      </div>

      <div v-if="success" class="mt-4 p-4 bg-green-900/50 text-green-200 rounded">
        Playlist créée avec succès !
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSpotify } from '~/composables/useSpotify'
import { useRouter } from 'vue-router'

const router = useRouter()
const spotify = useSpotify()

const name = ref('')
const description = ref('')
const isPublic = ref(false)
const isLoading = ref(false)
const error = ref(null)
const success = ref(false)

const createPlaylist = async () => {
  if (!name.value.trim()) return

  isLoading.value = true
  error.value = null
  success.value = false

  try {
    const playlist = await spotify.createPlaylist(
      name.value.trim(),
      description.value.trim(),
      isPublic.value
    )
    success.value = true
    // Redirect to the new playlist after a short delay
    setTimeout(() => {
      router.push(`/playlist/${playlist.id}`)
    }, 1500)
  } catch (err) {
    console.error('Error creating playlist:', err)
    error.value = 'Une erreur est survenue lors de la création de la playlist'
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