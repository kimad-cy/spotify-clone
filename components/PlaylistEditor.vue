<template>
  <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-gray-900 rounded-lg p-8 max-w-lg w-full">
      <h2 class="text-2xl font-bold mb-6">Edit Playlist</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Name</label>
          <input 
            v-model="editedName"
            type="text"
            class="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-spotify-green"
            placeholder="Playlist name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Description</label>
          <textarea 
            v-model="editedDescription"
            class="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-spotify-green"
            placeholder="Add an optional description"
            rows="3"
          ></textarea>
        </div>

        <div class="flex items-center space-x-2">
          <input 
            type="checkbox"
            v-model="editedIsPublic"
            id="public"
            class="form-checkbox h-4 w-4 text-spotify-green"
          />
          <label for="public" class="text-sm text-gray-400">Make playlist public</label>
        </div>
      </div>

      <div class="flex justify-end space-x-4 mt-8">
        <button 
          @click="$emit('close')"
          class="px-4 py-2 text-gray-400 hover:text-white"
        >
          Cancel
        </button>
        <button 
          @click="saveChanges"
          class="bg-spotify-green hover:bg-opacity-90 text-black font-bold py-2 px-6 rounded-full"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSpotify } from '~/composables/useSpotify'

const props = defineProps({
  playlist: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['playlist-updated', 'close'])
const spotify = useSpotify()

const editedName = ref('')
const editedDescription = ref('')
const editedIsPublic = ref(false)
const error = ref(null)

onMounted(() => {
  editedName.value = props.playlist.name
  editedDescription.value = props.playlist.description
  editedIsPublic.value = props.playlist.public
})

const saveChanges = async () => {
  try {
    error.value = null
    await spotify.updatePlaylistDetails(props.playlist.id, {
      name: editedName.value,
      description: editedDescription.value,
      public: editedIsPublic.value
    })
    emit('playlist-updated')
    emit('close')
  } catch (err) {
    console.error('Error updating playlist:', err)
    error.value = 'Failed to update playlist. Please try again.'
  }
}
</script>