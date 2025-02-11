<template>
  <div class="dollhouse-card" v-motion-slide-visible-bottom>
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold text-nirvana-blue">
          ฉบับที่ {{ wish.number }} จากคุณ {{ wish.name }}
        </h3>
        <a 
          v-if="wish.twitter"
          :href="`https://twitter.com/${wish.twitter}`"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-nirvana-light-blue hover:text-nirvana-blue transition-colors"
        >
          @{{ wish.twitter }}
        </a>
      </div>
    </div>

    <p class="text-gray-700 mb-4 whitespace-pre-wrap">{{ wish.message }}</p>

    <img
      v-if="wish.fanart"
      :src="wish.fanart"
      :alt="`แฟนอาร์ตโดย ${wish.name}`"
      class="w-full max-h-60 object-contain rounded-lg mb-4 shadow-dollhouse"
      loading="lazy"
    />

    <!-- New container for date and social buttons -->
    <div class="flex justify-between items-center mt-4">
      <span class="text-sm text-gray-500">
        {{ formatDate(wish.createdAt) }}
      </span>
      
      <div class="flex space-x-2">
        <button
          v-for="(social, index) in socials"
          :key="index"
          @click="shareWish(social.type)"
          class="p-2 text-nirvana-blue hover:text-nirvana-light-blue transition-colors"
          :title="`Share on ${social.name}`"
        >
          <component :is="social.icon" class="w-5 h-5" />
        </button>
        <!-- Open this wish icon button -->
        <button
          @click="openWish"
          class="p-2 text-nirvana-blue hover:text-nirvana-light-blue transition-colors"
          title="Open this wish"
        >
          <ArrowUpRightSquare class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Twitter, Facebook, Link, ArrowUpRightSquare } from 'lucide-vue-next'
import { format } from 'date-fns'

const props = defineProps({
  wish: {
    type: Object,
    required: true
  }
})

const socials = [
  { type: 'twitter', name: 'Twitter', icon: Twitter },
  { type: 'facebook', name: 'Facebook', icon: Facebook },
  { type: 'copy', name: 'Copy Link', icon: Link }
]

function formatDate(date) {
  return format(new Date(date), 'MMM d, yyyy')
}

function shareWish(type) {
  const text = `มาอวยพรวันเกิดให้น้องเนอร์กัน~! #NirvanaBirthday`
  const url = `${window.location.origin}/wish/${props.wish.number}`

  switch (type) {
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
      break
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
      break
    case 'copy':
      navigator.clipboard.writeText(url)
      break
  }
}

function openWish() {
  window.open(`${window.location.origin}/wish/${props.wish.number}`, '_blank')
}
</script>
