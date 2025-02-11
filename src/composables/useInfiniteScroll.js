import { ref, onMounted, onUnmounted } from 'vue'

export function useInfiniteScroll(callback, options = {}) {
  const containerRef = ref(null)
  const { threshold = 100, immediate = true } = options

  const handleScroll = () => {
    if (!containerRef.value) return

    const container = containerRef.value
    const { scrollTop, scrollHeight, clientHeight } = container

    if (scrollHeight - (scrollTop + clientHeight) < threshold) {
      callback?.()
    }
  }

  onMounted(() => {
    const container = containerRef.value
    if (container) {
      container.addEventListener('scroll', handleScroll)
      if (immediate) handleScroll()
    }
  })

  onUnmounted(() => {
    const container = containerRef.value
    if (container) {
      container.removeEventListener('scroll', handleScroll)
    }
  })

  return {
    containerRef
  }
}

export default useInfiniteScroll;
