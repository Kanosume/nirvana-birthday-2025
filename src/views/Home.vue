<template>
  <div class="space-y-8">
    <header class="text-center space-y-4">
      <h1 class="text-4xl font-bold text-nirvana-blue">
        อวยพรวันเกิดให้น้องเนอร์กัน~
      </h1>
      <p class="text-gray-600 max-w-2xl mx-auto">
        แบ่งปันคำอวยพรวันเกิดให้น้องตุ๊กตาสุดน่ารัก<br>เนอร์วาน่าของพวกเราเหล่าแฮนด์เลอร์!
      </p>
      <router-link
        to="/submit-wish"
        class="dollhouse-button inline-block"
      >
        อวยพร จิ้มเลย!
      </router-link>
    </header>

    <div
      ref="containerRef"
      class="scroll-container space-y-6 p-4"
    >
      <template v-if="wishes.length">
        <WishCard
          v-for="wish in wishes"
          :key="wish.id"
          :wish="wish"
        />
      </template>

      <LoadingSpinner v-if="loading" />

      <p
        v-if="!loading && !wishes.length"
        class="text-center text-gray-500"
      >
        ยังไม่มีใครอวยพรน้องเลย~ ทำไมไม่มาเป็นคนแรกล่ะ!
      </p>

      <p v-if="error" class="text-center text-red-500">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup>
// Use aliases '@' for importing components and composables
import { WishCard, LoadingSpinner } from '@/components'  // Ensure this path is correct
import { useWishes, useInfiniteScroll } from '@/composables'  // Ensure this path is correct

const {
  wishes,
  loading,
  error,
  hasMore,
  loadWishes
} = useWishes()

const { containerRef } = useInfiniteScroll(loadWishes, {
  threshold: 100
})
</script>

<style scoped>
/* Fix scrolling behavior in Safari */
.scroll-container {
  max-height: 800px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* Enables smooth scrolling in Safari */
}
</style>
