<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">Bienvenue</h1>
    
    <!-- Recently Played -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">Écoutés récemment</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="item in recentlyPlayed" :key="item.track.id" 
             class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer">
          <img :src="item.track.album.images[0]?.url" :alt="item.track.name" 
               class="w-full aspect-square object-cover rounded-md mb-3">
          <h3 class="font-medium truncate">{{ item.track.name }}</h3>
          <p class="text-gray-400 text-sm truncate">{{ item.track.artists.map(a => a.name).join(', ') }}</p>
        </div>
      </div>
    </section>

    <!-- Top Tracks -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">Vos titres préférés</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="track in topTracks" :key="track.id" 
             class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer">
          <img :src="track.album.images[0]?.url" :alt="track.name" 
               class="w-full aspect-square object-cover rounded-md mb-3">
          <h3 class="font-medium truncate">{{ track.name }}</h3>
          <p class="text-gray-400 text-sm truncate">{{ track.artists.map(a => a.name).join(', ') }}</p>
        </div>
      </div>
    </section>

    <!-- Top Artists -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">Vos artistes préférés</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        <div v-for="artist in topArtists" :key="artist.id" 
             class="text-center">
          <div class="relative group">
            <img :src="artist.images[0]?.url" :alt="artist.name" 
                 class="w-full aspect-square object-cover rounded-full mb-3">
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition rounded-full flex items-center justify-center">
              <button class="opacity-0 group-hover:opacity-100 bg-spotify-green text-black p-3 rounded-full">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>
          <h3 class="font-medium truncate">{{ artist.name }}</h3>
          <p class="text-gray-400 text-sm">Artiste</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { $spotify } = useNuxtApp()
const recentlyPlayed = ref([])
const topTracks = ref([])
const topArtists = ref([])

const fetchHomeData = async () => {
  try {
    const [recentlyPlayedData, topTracksData, topArtistsData] = await Promise.all([
      $spotify.getRecentlyPlayed(),
      $spotify.getTopTracks(),
      $spotify.getTopArtists()
    ])

    recentlyPlayed.value = recentlyPlayedData.items
    topTracks.value = topTracksData.items
    topArtists.value = topArtistsData.items
  } catch (error) {
    console.error('Error fetching home data:', error)
  }
}

onMounted(() => {
  fetchHomeData()
})
</script>

<style>
.bg-spotify-green {
  background-color: #1DB954;
}
</style>