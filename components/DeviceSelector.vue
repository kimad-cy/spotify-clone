<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Select Playback Device</h2>
      
      <div v-if="devices.length === 0" class="text-center py-4">
        <p>No active devices found.</p>
        <p class="text-sm text-gray-400 mt-2">Please open Spotify on any device</p>
      </div>
      
      <div v-else class="space-y-2 max-h-96 overflow-y-auto">
        <button
          v-for="device in devices"
          :key="device.id"
          @click="selectDevice(device)"
          class="w-full p-3 text-left hover:bg-gray-700 rounded flex items-center"
          :class="{ 'bg-gray-700': device.id === selectedDeviceId }"
        >
          <div class="flex-1">
            <p class="font-medium">{{ device.name }}</p>
            <p class="text-sm text-gray-400">{{ device.type }}</p>
          </div>
          <svg v-if="device.id === selectedDeviceId" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
        </button>
      </div>
      
      <div class="mt-6 flex justify-end">
        <button @click="$emit('close')" class="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { usePlayerStore } from '../stores/player';

export default {
  props: {
    show: Boolean
  },
  setup() {
    const playerStore = usePlayerStore();
    
    return {
      devices: playerStore.availableDevices,
      selectedDeviceId: playerStore.selectedDeviceId
    };
  },
  methods: {
    async selectDevice(device) {
      const playerStore = usePlayerStore();
      await playerStore.setDevice(device.id);
      this.$emit('device-selected', device.id);
      this.$emit('close');
    }
  }
}
</script>