<template>
  <div class="social-share flex gap-4 justify-center items-center">
    <!-- Twitter/X Share -->
    <button
      @click="shareOnTwitter"
      class="p-2 rounded-full bg-black hover:bg-gray-800 transition-colors"
      aria-label="Share on Twitter"
    >
      <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    </button>

    <!-- Facebook Share -->
    <button
      @click="shareOnFacebook"
      class="p-2 rounded-full bg-[#1877F2] hover:bg-[#166fe5] transition-colors"
      aria-label="Share on Facebook"
    >
      <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </button>

    <!-- Copy Link -->
    <button
      @click="copyLink"
      class="p-2 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors relative"
      aria-label="Copy link"
    >
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
      </svg>
      <span
        v-if="copied"
        class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded fade-in"
      >
        Copied!
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  wishId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Nirvana Birthday Celebration 2025'
  }
});

const copied = ref(false);

const shareUrl = computed(() => {
  return `${window.location.origin}/wish/${props.wishId}`;
});

const shareOnTwitter = () => {
  const text = encodeURIComponent(`Check out this birthday wish for Nirvana! ${props.title}`);
  const url = encodeURIComponent(shareUrl.value);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
};

const shareOnFacebook = () => {
  const url = encodeURIComponent(shareUrl.value);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
