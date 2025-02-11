import { ref } from 'vue'
import { wishesAPI } from '@/services/api'

export function useWishes() {
  const wishes = ref([])
  const wish = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const hasMore = ref(true)
  const currentPage = ref(1)
  const ITEMS_PER_PAGE = 10

  async function loadWishes() {
    if (loading.value || !hasMore.value) return

    try {
      loading.value = true
      error.value = null

      const response = await wishesAPI.getAllWishes();
      
      if (response.wishes) {
        wishes.value = currentPage.value === 1 
          ? response.wishes 
          : [...wishes.value, ...response.wishes]
        
        hasMore.value = response.hasMore
        currentPage.value++
      }
    } catch (err) {
      console.error('Error loading wishes:', err)
      error.value = 'Failed to load wishes. Please try again later.'
    } finally {
      loading.value = false
    }
  }

  async function fetchWish(id) {
    if (!id) {
      error.value = 'Wish ID is required'
      return
    }

    try {
      loading.value = true
      error.value = null
      wish.value = null

      const foundWish = await wishesAPI.getById(id)
      if (foundWish) {
        wish.value = foundWish
      } else {
        error.value = 'Wish not found'
      }
    } catch (err) {
      console.error('Error fetching wish:', err)
      error.value = 'Failed to load wish. Please try again later.'
    } finally {
      loading.value = false
    }
  }

  // Initial load for list view
  loadWishes()

  return {
    wishes,
    wish,
    loading,
    error,
    hasMore,
    loadWishes,
    fetchWish
  }
}

export default useWishes;
