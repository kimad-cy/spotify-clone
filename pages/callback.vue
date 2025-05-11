<template>
  <div class="flex items-center justify-center h-full">
    <div v-if="loading" class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
      <p class="text-xl">Connexion en cours...</p>
    </div>
    <div v-else-if="error" class="text-center">
      <div class="text-red-500 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
        </svg>
      </div>
      <h2 class="text-2xl font-bold mb-2">Erreur d'authentification</h2>
      <p class="text-gray-400 mb-4">{{ error }}</p>
      <button 
        @click="retryLogin"
        class="bg-spotify-green hover:bg-opacity-90 text-black font-bold py-2 px-6 rounded-full"
      >
        Réessayer
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSpotify } from '~/composables/useSpotify'

const router = useRouter()
const route = useRoute()
const spotify = useSpotify()

const loading = ref(true)
const error = ref(null)

const handleCallback = async () => {
  // Get the authorization code from URL
  const code = route.query.code
  const errorParam = route.query.error
  
  if (errorParam) {
    error.value = 'Accès refusé. Veuillez autoriser l\'application.'
    loading.value = false
    return
  }
  
  if (!code) {
    error.value = 'Aucun code d\'autorisation fourni.'
    loading.value = false
    return
  }
  
  try {
    // Exchange code for access token
    const success = await spotify.exchangeCodeForToken(code)
    if (success) {
      // Add a small delay to ensure tokens are saved
      await new Promise(resolve => setTimeout(resolve, 500))
      router.push('/dashboard')
    } else {
      error.value = 'Échec de l\'authentification. Veuillez réessayer.'
    }
  } catch (err) {
    console.error('Error during token exchange:', err)
    error.value = err.response?.data?.error_description || 'Une erreur s\'est produite lors de l\'authentification.'
  } finally {
    loading.value = false
  }
}

const retryLogin = async () => {
  loading.value = true
  error.value = null
  // Clear any existing tokens
  localStorage.clear()
  // Add a small delay before redirecting
  await new Promise(resolve => setTimeout(resolve, 500))
  const authUrl = spotify.getAuthUrl()
  window.location.href = authUrl
}

onMounted(() => {
  handleCallback()
})
</script>

<style>
.bg-spotify-green {
  background-color: #1DB954;
}
</style>