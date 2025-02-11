<template>
  <div class="space-y-4">
    <div
      class="border-2 border-dashed border-nirvana-blue/20 rounded-lg p-8 text-center"
      :class="{ 'bg-nirvana-blue/5': isDragging }"
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @dragover.prevent
      @drop.prevent="handleDrop"
      @click.stop
    >
      <div v-if="!preview" class="space-y-2">
        <div class="flex justify-center">
          <ImageIcon class="w-12 h-12 text-nirvana-blue/40" />
        </div>
        <p class="text-gray-600">
          ลากและวางแฟนอาร์ตของคุณที่นี่ หรือ
          <button
            type="button"
            @click.stop="triggerFileInput"
            class="text-nirvana-blue hover:text-nirvana-light-blue transition-colors"
          >
            เลือกไฟล์
          </button>
        </p>
        <p class="text-sm text-gray-500">
          รอบรับไฟล์ประเภท: JPG, PNG, GIF (max 100MB)
        </p>
      </div>

      <img
        v-else
        :src="preview"
        alt="Preview"
        class="max-h-64 mx-auto rounded-lg shadow-dollhouse"
      />

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>

    <div v-if="preview" class="flex justify-end space-x-2">
      <button
        type="button"
        @click.stop="clearImage"
        class="text-gray-500 hover:text-gray-700 transition-colors"
      >
        Clear
      </button>
    </div>

    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ImageIcon } from 'lucide-vue-next'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:file'])
const fileInput = ref(null)
const preview = ref(null)
const error = ref(null)
const isDragging = ref(false)

function triggerFileInput(e) {
  e.preventDefault()
  e.stopPropagation()
  if (!props.disabled) {
    fileInput.value.click()
  }
}

function handleFileSelect(event) {
  event.preventDefault()
  event.stopPropagation()
  const file = event.target.files[0]
  processFile(file)
}

function handleDrop(event) {
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  processFile(file)
}

function processFile(file) {
  if (!file) return

  error.value = null

  if (!file.type.startsWith('image/')) {
    error.value = 'Please select an image file'
    return
  }

  if (file.size > 100 * 1024 * 1024) {
    error.value = 'Image size should be less than 100MB'
    return
  }

  const reader = new FileReader()
  reader.onload = e => {
    preview.value = e.target.result
    emit('update:file', file)
  }
  reader.readAsDataURL(file)
}

function clearImage(e) {
  e.preventDefault()
  e.stopPropagation()
  preview.value = null
  error.value = null
  emit('update:file', null)
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>
