import { ref, onMounted } from 'vue';
import axios from 'axios';

export function useWishes() {
    const wishes = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const fetchWishes = async () => {
        try {
            const response = await axios.get('/api/wishes');
            wishes.value = response.data;
        } catch (err) {
            error.value = err.message || 'Failed to fetch wishes';
        } finally {
            loading.value = false;
        }
    };

    onMounted(fetchWishes);

    return { wishes, loading, error, fetchWishes };
}
