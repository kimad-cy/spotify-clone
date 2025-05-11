import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useSpotify } from '~/composables/useSpotify';
import type { SpotifyApi } from '~/types/spotify';

interface PlayerState {
  currentTrack: SpotifyApi.TrackObjectFull | null;
  isPlaying: boolean;
  volume: number;
  deviceId: string | null;
  devices: SpotifyApi.UserDevice[];
  isActive: boolean;
}

export const usePlayerStore = defineStore('player', () => {
  const spotify = useSpotify();
  const currentTrack = ref<SpotifyApi.TrackObjectFull | null>(null);
  const isPlaying = ref(false);
  const volume = ref(50);
  const deviceId = ref<string | null>(null);
  const devices = ref<SpotifyApi.UserDevice[]>([]);
  const isActive = ref(false);

  const currentTrackName = computed(() => currentTrack.value?.name || 'No track playing');
  const currentTrackArtists = computed(() => 
    currentTrack.value?.artists.map(artist => artist.name).join(', ') || ''
  );
  const currentTrackImage = computed(() => 
    currentTrack.value?.album.images[0]?.url || 'https://via.placeholder.com/150'
  );

  const initialize = async () => {
    try {
      const state = await spotify.getPlaybackState();
      if (state) {
        currentTrack.value = state.item;
        isPlaying.value = state.is_playing;
        volume.value = state.device.volume_percent;
        deviceId.value = state.device.id;
        isActive.value = true;
      }
    } catch (error) {
      console.error('Error initializing player:', error);
    }
  };

  const play = async (uri: string) => {
    try {
      await spotify.playTrack(uri);
      await initialize();
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const pause = async () => {
    try {
      await spotify.pause();
      isPlaying.value = false;
    } catch (error) {
      console.error('Error pausing playback:', error);
    }
  };

  const resume = async () => {
    try {
      await spotify.resume();
      isPlaying.value = true;
    } catch (error) {
      console.error('Error resuming playback:', error);
    }
  };

  const skipToNext = async () => {
    try {
      await spotify.skipToNext();
      await initialize();
    } catch (error) {
      console.error('Error skipping to next track:', error);
    }
  };

  const skipToPrevious = async () => {
    try {
      await spotify.skipToPrevious();
      await initialize();
    } catch (error) {
      console.error('Error skipping to previous track:', error);
    }
  };

  const setVolume = async (value: number) => {
    try {
      await spotify.setVolume(value);
      volume.value = value;
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  const transferPlayback = async (newDeviceId: string) => {
    try {
      await spotify.transferPlayback(newDeviceId);
      deviceId.value = newDeviceId;
    } catch (error) {
      console.error('Error transferring playback:', error);
    }
  };

  return {
    spotify,
    currentTrack,
    isPlaying,
    volume,
    deviceId,
    devices,
    isActive,
    currentTrackName,
    currentTrackArtists,
    currentTrackImage,
    initialize,
    play,
    pause,
    resume,
    skipToNext,
    skipToPrevious,
    setVolume,
    transferPlayback
  };
}); 