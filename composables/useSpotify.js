import axios from 'axios'
import { ref } from 'vue'

// Spotify API URLs
const BASE_URL = 'https://api.spotify.com/v1'
const AUTH_URL = 'https://accounts.spotify.com/authorize'
const TOKEN_URL = 'https://accounts.spotify.com/api/token'

// Client credentials
const CLIENT_ID = '9c2486f9c4074794909af6be8e8092bd'
const CLIENT_SECRET = '38d294c65b334047a8817a3c5f0de758'
const REDIRECT_URI = 'http://127.0.0.1:3000/callback'
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-library-read',
  'user-library-modify',
  'user-read-playback-state',
  'user-top-read',
  'user-read-recently-played',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-follow-read',
  'streaming'
].join(' ')

// Local storage keys
const TOKEN_KEY = 'spotify_access_token'
const REFRESH_TOKEN_KEY = 'spotify_refresh_token'
const EXPIRATION_KEY = 'spotify_token_expiration'

export const useSpotify = () => {
  const accessToken = ref(null)
  const refreshToken = ref(null)
  const tokenExpiration = ref(null)
  const userId = ref(null)
  const player = ref(null)
  const deviceId = ref(null)
  const isPlayerReady = ref(false)

  const initializePlayer = async () => {
    if (!window.Spotify) {
      const script = document.createElement('script')
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      script.async = true
      document.body.appendChild(script)

      await new Promise((resolve) => {
        window.onSpotifyWebPlaybackSDKReady = resolve
      })
    }

    player.value = new window.Spotify.Player({
      name: 'Spotify Clone Web Player',
      getOAuthToken: cb => { cb(accessToken.value) },
      volume: 0.5
    })

    // Error handling
    player.value.addListener('initialization_error', ({ message }) => {
      console.error('Failed to initialize:', message)
    })

    player.value.addListener('authentication_error', ({ message }) => {
      console.error('Failed to authenticate:', message)
    })

    player.value.addListener('account_error', ({ message }) => {
      console.error('Failed to validate Spotify account:', message)
    })

    player.value.addListener('playback_error', ({ message }) => {
      console.error('Failed to perform playback:', message)
    })

    // Playback status updates
    player.value.addListener('player_state_changed', state => {
      console.log('Player state changed:', state)
    })

    // Ready
    player.value.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id)
      deviceId.value = device_id
      isPlayerReady.value = true
    })

    // Not Ready
    player.value.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id)
      isPlayerReady.value = false
    })

    // Connect to the player
    await player.value.connect()
  }

  const getAuthUrl = () => {
    return `${AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`
  }

  const exchangeCodeForToken = async (code) => {
    try {
      // Clear any existing tokens before exchanging
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(EXPIRATION_KEY)
      localStorage.removeItem('user')

      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      })

      const response = await axios.post(
        TOKEN_URL,
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          }
        }
      )

      if (!response.data.access_token) {
        throw new Error('No access token in response')
      }

      const expirationTime = new Date().getTime() + response.data.expires_in * 1000

      // Save tokens to local storage
      localStorage.setItem(TOKEN_KEY, response.data.access_token)
      localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh_token)
      localStorage.setItem(EXPIRATION_KEY, expirationTime)

      // After successful login, fetch the user data and save to localStorage
      const userProfile = await getCurrentUserProfile()
      localStorage.setItem('user', JSON.stringify(userProfile))

      accessToken.value = response.data.access_token
      refreshToken.value = response.data.refresh_token
      tokenExpiration.value = expirationTime
      userId.value = userProfile.id

      return true
    } catch (error) {
      console.error('Error exchanging code for token:', error.response?.data || error.message)
      // Clear any partial data
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(EXPIRATION_KEY)
      localStorage.removeItem('user')
      accessToken.value = null
      refreshToken.value = null
      tokenExpiration.value = null
      userId.value = null
      return false
    }
  }

  const refreshAccessToken = async () => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    
    if (!storedRefreshToken) {
      throw new Error('No refresh token available')
    }
    
    try {
      const response = await axios.post(
        TOKEN_URL,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: storedRefreshToken,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
      
      const expirationTime = new Date().getTime() + response.data.expires_in * 1000
      
      // Update tokens in storage
      localStorage.setItem(TOKEN_KEY, response.data.access_token)
      localStorage.setItem(EXPIRATION_KEY, expirationTime)
      
      accessToken.value = response.data.access_token
      refreshToken.value = response.data.refresh_token
      tokenExpiration.value = expirationTime

      return response.data
    } catch (error) {
      console.error('Error refreshing token:', error)
      throw error
    }
  }

  const getValidToken = async () => {
    const storedAccessToken = localStorage.getItem(TOKEN_KEY)
    const expirationTime = localStorage.getItem(EXPIRATION_KEY)
    
    if (!storedAccessToken || !expirationTime) {
      return null
    }
    
    // If token expires in less than 5 minutes, refresh it
    if (new Date().getTime() > (expirationTime - 300000)) {
      try {
        const data = await refreshAccessToken()
        return data.access_token
      } catch (error) {
        console.error('Failed to refresh token:', error)
        return null
      }
    }
    
    return storedAccessToken
  }

  const getAuthenticatedApi = async () => {
    const token = await getValidToken()
    
    if (!token) {
      throw new Error('No valid token available')
    }
    
    return axios.create({
      baseURL: BASE_URL,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  const getCurrentUserProfile = async () => {
    try {
      const api = await getAuthenticatedApi()
      const response = await api.get('/me')
      return response.data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw error
    }
  }

  const getRecentlyPlayed = async (limit = 20) => {
    try {
      const api = await getAuthenticatedApi()
      const response = await api.get('/me/player/recently-played', {
        params: { limit }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching recently played:', error)
      throw error
    }
  }

  const getPlaybackState = async () => {
    try {
      const api = await getAuthenticatedApi()
      const response = await api.get('/me/player')
      return response.data
    } catch (error) {
      console.error('Error fetching playback state:', error)
      throw error
    }
  }

  const checkAuth = async () => {
    try {
      const token = await getValidToken()
      if (!token) return false
      
      const api = await getAuthenticatedApi()
      await api.get('/me')
      return true
    } catch (error) {
      return false
    }
  }

  const logout = async () => {
    try {
      // Clear all Spotify-related data from localStorage
      localStorage.removeItem('spotify_access_token')
      localStorage.removeItem('spotify_refresh_token')
      localStorage.removeItem('spotify_token_expires_at')
      localStorage.removeItem('spotify_user_id')
      
      // Clear any other Spotify-related state
      if (window.spotifyPlayer) {
        await window.spotifyPlayer.disconnect()
      }

      accessToken.value = null
      refreshToken.value = null
      tokenExpiration.value = null
      userId.value = null
      player.value = null
      deviceId.value = null
      isPlayerReady.value = false
    } catch (error) {
      console.error('Error during logout:', error)
      throw error
    }
  }

  const getTopTracks = async (timeRange = 'medium_term', limit = 20) => {
    try {
      const api = await getAuthenticatedApi()
      const response = await api.get('/me/top/tracks', {
        params: {
          time_range: timeRange,
          limit: limit
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching top tracks:', error)
      throw error
    }
  }

  const getTopArtists = async (timeRange = 'medium_term', limit = 20) => {
    try {
      const api = await getAuthenticatedApi()
      const response = await api.get('/me/top/artists', {
        params: {
          time_range: timeRange,
          limit: limit
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching top artists:', error)
      throw error
    }
  }

  const search = async (query, types = ['track', 'artist', 'album', 'playlist'], limit = 20) => {
    try {
      const api = await getAuthenticatedApi()
      const response = await api.get('/search', {
        params: {
          q: query,
          type: types.join(','),
          limit
        }
      })
      return response.data
    } catch (error) {
      console.error('Error searching:', error)
      throw error
    }
  }

  const getLikedSongs = async (limit = 20, offset = 0) => {
    try {
      const api = await getAuthenticatedApi()
      const response = await api.get('/me/tracks', {
        params: { limit, offset }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching liked songs:', error)
      throw error
    }
  }

  const toggleLikeTrack = async (trackId, isLiked) => {
    try {
      const api = await getAuthenticatedApi()
      if (isLiked) {
        await api.delete(`/me/tracks`, { data: { ids: [trackId] } })
      } else {
        await api.put(`/me/tracks`, { ids: [trackId] })
      }
      return true
    } catch (error) {
      console.error('Error toggling like:', error)
      throw error
    }
  }

  const createPlaylist = async (name, description = '', isPublic = false) => {
    try {
      const user = await getCurrentUserProfile()
      const api = await getAuthenticatedApi()
      const response = await api.post(`/users/${user.id}/playlists`, {
        name,
        description,
        public: isPublic
      })
      return response.data
    } catch (error) {
      console.error('Error creating playlist:', error)
      throw error
    }
  }

  const addTracksToPlaylist = async (playlistId, trackUris) => {
    try {
      const api = await getAuthenticatedApi()
      const response = await api.post(`/playlists/${playlistId}/tracks`, {
        uris: trackUris
      })
      return response.data
    } catch (error) {
      console.error('Error adding tracks to playlist:', error)
      throw error
    }
  }

  const getUserPlaylists = async (limit = 20, offset = 0) => {
    try {
      const api = await getAuthenticatedApi()
      const response = await api.get('/me/playlists', {
        params: { limit, offset }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching user playlists:', error)
      throw error
    }
  }

  const getPlaylist = async (playlistId) => {
    try {
      const api = await getAuthenticatedApi()
      const response = await api.get(`/playlists/${playlistId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching playlist:', error)
      throw error
    }
  }

  const removeTracksFromPlaylist = async (playlistId, trackUris) => {
    try {
      const api = await getAuthenticatedApi()
      const response = await api.delete(`/playlists/${playlistId}/tracks`, {
        data: {
          tracks: trackUris.map(uri => ({ uri }))
        }
      })
      return response.data
    } catch (error) {
      console.error('Error removing tracks from playlist:', error)
      throw error
    }
  }

  const searchTracks = async (query, limit = 20) => {
    try {
      const api = await getAuthenticatedApi()
      const response = await api.get('/search', {
        params: {
          q: query,
          type: 'track',
          limit
        }
      })
      return response.data
    } catch (error) {
      console.error('Error searching tracks:', error)
      throw error
    }
  }

  const playTrack = async (trackUri) => {
    try {
      // Extract the track ID from the URI
      const trackId = trackUri.split(':').pop()
      
      // Open the track in Spotify
      window.open(`https://open.spotify.com/track/${trackId}`, '_blank')
      
      return true
    } catch (error) {
      console.error('Error opening track in Spotify:', error)
      return false
    }
  }

  const pauseTrack = async () => {
    return true
  }

  const resumeTrack = async () => {
    return true
  }

  const getArtist = async (artistId) => {
    try {
      const api = await getAuthenticatedApi()
      const response = await api.get(`/artists/${artistId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching artist:', error)
      throw error
    }
  }

  const getArtistTopTracks = async (artistId) => {
    try {
      const api = await getAuthenticatedApi()
      const response = await api.get(`/artists/${artistId}/top-tracks`, {
        params: {
          market: 'FR'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching artist top tracks:', error)
      throw error
    }
  }

  const getArtistAlbums = async (artistId) => {
    try {
      const api = await getAuthenticatedApi()
      const response = await api.get(`/artists/${artistId}/albums`, {
        params: {
          include_groups: 'album,single',
          market: 'FR',
          limit: 50
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching artist albums:', error)
      throw error
    }
  }

  const getAlbum = async (albumId) => {
    try {
      const api = await getAuthenticatedApi()
      const response = await api.get(`/albums/${albumId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching album:', error)
      throw error
    }
  }

  const getFollowedArtists = async (limit = 50) => {
    try {
      const api = await getAuthenticatedApi()
      const response = await api.get('/me/following', {
        params: {
          type: 'artist',
          limit
        }
      })
      return response.data.artists
    } catch (error) {
      console.error('Error fetching followed artists:', error)
      throw error
    }
  }

  return {
    accessToken,
    refreshToken,
    tokenExpiration,
    userId,
    player,
    deviceId,
    isPlayerReady,
    initializePlayer,
    getAuthUrl,
    exchangeCodeForToken,
    checkAuth,
    logout,
    getCurrentUserProfile,
    getRecentlyPlayed,
    getPlaybackState,
    getTopTracks,
    getTopArtists,
    search,
    getLikedSongs,
    toggleLikeTrack,
    createPlaylist,
    addTracksToPlaylist,
    removeTracksFromPlaylist,
    getUserPlaylists,
    getPlaylist,
    searchTracks,
    playTrack,
    pauseTrack,
    resumeTrack,
    getArtist,
    getArtistTopTracks,
    getArtistAlbums,
    getFollowedArtists,
    getAlbum,
  }
} 