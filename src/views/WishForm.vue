<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold text-nirvana-blue text-center mb-8">
      มาอวยพรวันเกิดให้น้องเนอร์กัน~
    </h1>

    <form @submit.prevent="handleSubmit" class="dollhouse-card space-y-6">
      <div>
        <label class="block text-gray-700 mb-2" for="name">
          ชื่อ *
        </label>
        <input
          id="name"
          v-model.trim="form.name"
          type="text"
          required
          class="form-input"
          :disabled="submitting"
        />
      </div>

      <div>
        <label class="block text-gray-700 mb-2" for="twitter">
          Twitter (optional)
        </label>
        <div class="relative">
          <span class="absolute left-3 top-2 text-gray-500">@</span>
          <input
            id="twitter"
            v-model.trim="form.twitter"
            type="text"
            class="form-input pl-8"
            :disabled="submitting"
          />
        </div>
      </div>

      <div>
        <label class="block text-gray-700 mb-2" for="message">
          คำอวยพร *
        </label>
        <textarea
          id="message"
          v-model.trim="form.message"
          required
          rows="4"
          class="form-input"
          :disabled="submitting"
        ></textarea>
      </div>

      <div>
        <label class="block text-gray-700 mb-2">
          รูปแฟนอาร์ต (optional)
        </label>
        <ImageUpload
          v-model:file="form.fanart"
          :disabled="submitting"
          @click.stop
        />
      </div>

      <div
        v-if="error"
        class="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4"
      >
        {{ error }}
      </div>

      <div class="flex justify-end space-x-4">
        <router-link
          to="/"
          class="text-gray-500 hover:text-gray-700 transition-colors py-2 px-4"
          :disabled="submitting"
        >
          Cancel
        </router-link>
        <button
          type="submit"
          class="dollhouse-button"
          :disabled="submitting"
        >
          <template v-if="submitting">
            <LoadingSpinner class="w-5 h-5" />
            กำลังมอบคำอวยพร
          </template>
          <template v-else>
            ส่งคำอวยพร
          </template>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import ImageUpload from '@/components/ImageUpload.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { wishesAPI, uploadsAPI, submitWish } from '@/services/api';

const router = useRouter();
const submitting = ref(false);
const error = ref(null);

const form = ref({
  name: '',
  twitter: '',
  message: '',
  fanart: null
});

async function handleSubmit(e) {
  e.preventDefault();
  
  if (submitting.value) return;

  // Validate form
  if (!form.value.name.trim() || !form.value.message.trim()) {
    error.value = 'Name and message are required.';
    return;
  }

  submitting.value = true;
  error.value = null;

  try {
    const formData = new FormData();
    formData.append('name', form.value.name.trim());
    formData.append('message', form.value.message.trim());
    
    if (form.value.twitter.trim()) {
      formData.append('twitter', form.value.twitter.trim());
    }
    
    if (form.value.fanart) {
      formData.append('fanart', form.value.fanart);
    }

    await submitWish(formData);
    toast.success('Your wish has been submitted!');
    router.push('/');
  } catch (e) {
    error.value = e.message || 'Failed to submit wish';
    toast.error('Failed to submit wish');
  } finally {
    submitting.value = false;
  }
}
</script>
